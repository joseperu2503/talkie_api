import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interfaces';
import { OnEvent } from '@nestjs/event-emitter';
import { MessageSendedEvent } from '../events/message-sended.event';
import { SendMessageDto } from '../dto/send-message.dto';
import { MessageResponseDto } from '../dto/message-response.dto';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from 'src/auth/guards/ws-jwt.guard';
import { MarkChatAsReadDto } from '../dto/mark-chat-as-read.dto';
import { ChatUpdatedEvent } from '../events/chat-updated.event';
import { AuthService } from 'src/auth/auth.service';
import { UpdateUserStatusDto } from '../dto/update-user-status.dto';
import { ContactUpdatedEvent } from '../events/contact-updated.event';
import { ContactResourceDto } from 'src/contacts/dto/contact-resource.dto';
import { chatResource, isImageUrl } from '../resources/chat.resource';
import { ChatService } from '../services/chat.service';

@WebSocketGateway({ cors: true, namespace: '/chats' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authService: AuthService,

    private readonly chatService: ChatService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  @OnEvent('message.sended')
  handleMessageSendedEvent(event: MessageSendedEvent) {
    this.emitMessageReceived(event);
  }

  @OnEvent('chat.updated')
  handleChatUpdatedEvent(event: ChatUpdatedEvent) {
    this.emitChatUpdated(event);
  }

  @OnEvent('contact.updated')
  handleContactUpdate(event: ContactUpdatedEvent) {
    this.emitContactUpdated(event);
  }

  async handleConnection(client: Socket) {
    // console.log('Client connected:', client.id);
    const token = client.handshake.query.token as string;
    let payload: JwtPayload;
    // console.log('token:', token);

    try {
      payload = this.jwtService.verify(token);
      const user = await this.userRepository.findOneBy({ id: payload.id });

      if (!user) {
        client.disconnect();
        return;
      }

      console.log(
        `Usuario ${user.id} - ${user.name} ${user.surname} conectado al socket`,
      );

      await client.join(`user-${user.id}-connected`);
      await this.verifyClientsInRoom(user);
    } catch (error) {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);

    // Obtener el token de la conexión del cliente
    const token = client.handshake.query.token as string;

    // Verificar y obtener el payload del token
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
    } catch (error) {
      console.error('Error verifying token on disconnect:', error);
      return; // Si el token no es válido, simplemente salimos
    }

    // Buscar al usuario en la base de datos
    const user = await this.userRepository.findOneBy({ id: payload.id });
    if (user) {
      // Verificar clientes en la sala después de la desconexión
      await this.verifyClientsInRoom(user);
    }
  }

  async emitMessageReceived(event: MessageSendedEvent) {
    const chat = event.chat;

    for (let userId of chat.usersId) {
      const room = `user-${userId}-connected`;

      const data: {
        message: MessageResponseDto;
        chatId: string;
      } = {
        message: {
          id: event.message.id,
          content: event.message.content,
          timestamp: event.message.timestamp,
          sender: {
            id: event.message.sender.id,
            name: event.message.sender.name,
            surname: event.message.sender.surname,
            email: event.message.sender.email,
          },
          isSender: event.message.sender.id == userId,
          isImage: isImageUrl(event.message.fileUrl),
        },
        chatId: event.message.chat.id,
      };

      this.server.to(room).emit('messageReceived', data);
    }
  }

  async emitChatUpdated(event: ChatUpdatedEvent) {
    const chat = event.chat;

    for (let userId of chat.usersId) {
      const room = `user-${userId}-connected`;

      const chatUpdated = chatResource(chat, userId);

      this.server.to(room).emit('chatUpdated', chatUpdated);
    }
  }

  async emitContactUpdated(event: ContactUpdatedEvent) {
    const user = event.user;
    console.log('contactUpdated');
    for (let contact of event.contacts) {
      const room = `user-${contact.targetContact.id}-connected`;

      const contactUpdated: ContactResourceDto = {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        photo: user.photo,
        phone: user.phone,
        isConnected: user.isConnected,
        lastConnection: user.lastConnection,
        chatId: contact.chat.id,
      };

      this.server.to(room).emit('contactUpdated', contactUpdated);
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: SendMessageDto) {
    const sender: User = client['user'];
    console.log(`${sender.name} ${sender.surname} send message:`, payload);

    return await this.chatService.sendMessage(payload, sender);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('markChatAsRead')
  async handleMarkChatAsRead(client: Socket, payload: MarkChatAsReadDto) {
    const sender: User = client['user'];
    return await this.chatService.markChatAsReadDto(payload, sender);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('updateDeviceConnectionStatus')
  async updateDeviceConnectionStatus(
    client: Socket,
    payload: UpdateUserStatusDto,
  ) {
    const user: User = client['user'];
    // Unirse a diferentes canales según el estado de conexión
    if (payload.isConnected) {
      client.join(`user-${user.id}-connected`);
      // También puedes asegurarte de que el usuario no esté en el canal de desconectados
      client.leave(`user-${user.id}-disconnected`);
    } else {
      client.join(`user-${user.id}-disconnected`);
      // También puedes asegurarte de que el usuario no esté en el canal de conectados
      client.leave(`user-${user.id}-connected`);
    }

    await this.verifyClientsInRoom(user);
  }

  async verifyClientsInRoom(user: User) {
    const room = `user-${user.id}-connected`;

    // Verificar si hay clientes en el canal de conectados
    const clientsInRoom = await this.server.in(room).fetchSockets();
    const isConnected = clientsInRoom.length > 0;

    console.log(`${user.name} ${user.surname} is connected: ${isConnected}`);

    const updateUserStatusDto: UpdateUserStatusDto = {
      isConnected: isConnected,
    };

    if (isConnected != user.isConnected) {
      await this.authService.updateStatus(user, updateUserStatusDto);
    }
  }
}
