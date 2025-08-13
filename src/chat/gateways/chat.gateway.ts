import { UseGuards } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from 'src/auth/guards/ws-jwt.guard';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interfaces';
import { ContactResourceDto } from 'src/contacts/dto/contact-resource.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';
import { Repository } from 'typeorm';
import { MessageDeliveredRequestDto } from '../dto/message-delivered-request.dto';
import { ReadChatRequestDto } from '../dto/read-chat-request.dto';
import { SendMessageRequestDto } from '../dto/send-message-request.dto';
import { UpdateUserStatusRequestDto } from '../dto/update-user-status-request.dto';
import { ChatUpdatedEvent } from '../events/chat-updated.event';
import { ContactUpdatedEvent } from '../events/contact-updated.event';
import { chatResource } from '../resources/chat.resource';
import { MessageResource } from '../resources/message.resource';
import { ChatService } from '../services/chat.service';

@WebSocketGateway({ cors: true, namespace: '/chats' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly usersService: UsersService,

    private readonly chatService: ChatService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  @OnEvent('message.updated')
  handleMessageSendedEvent(event: MessageResource) {
    this.emitMessageUpdated(event);
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
      await this._updateUserStatus(user);
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
      await this._updateUserStatus(user);
    }
  }

  //** Emitir al usuario de un nuevo mensaje, un mensaje ha sido leido o entregado */
  async emitMessageUpdated(messageResource: MessageResource) {
    const room = `user-${messageResource.userId}-connected`;

    this.server.to(room).emit('messageUpdated', messageResource.response);
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
  async handleSendMessage(client: Socket, payload: SendMessageRequestDto) {
    const sender: User = client['user'];
    console.log(`${sender.name} ${sender.surname} send message:`, payload);

    return await this.chatService.sendMessage(payload, sender);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('messageDelivered')
  async handleReceiveMessage(
    client: Socket,
    payload: MessageDeliveredRequestDto,
  ) {
    const receiver: User = client['user'];

    return await this.chatService.messageDelivered(payload, receiver);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('readChat')
  async handleReadChat(client: Socket, payload: ReadChatRequestDto) {
    const sender: User = client['user'];
    return await this.chatService.readChat(payload, sender);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('updateDeviceConnectionStatus')
  async updateDeviceConnectionStatus(
    client: Socket,
    payload: UpdateUserStatusRequestDto,
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

    await this._updateUserStatus(user);
  }

  private async _updateUserStatus(user: User) {
    const isConnected = await this._verifyClientsInRoom(user.id);
    console.log(`${user.name} ${user.surname} is connected: ${isConnected}`);

    const updateUserStatusDto: UpdateUserStatusRequestDto = {
      isConnected: isConnected,
    };

    if (isConnected != user.isConnected) {
      await this.usersService.updateStatus(user, updateUserStatusDto);
    }
  }

  private async _verifyClientsInRoom(userId: number) {
    const room = `user-${userId}-connected`;

    // Verificar si hay clientes en el canal de conectados
    const clientsInRoom = await this.server.in(room).fetchSockets();
    const isConnected = clientsInRoom.length > 0;

    return isConnected;
  }
}
