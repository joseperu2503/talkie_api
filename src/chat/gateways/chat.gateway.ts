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
import { ChatService, chatResource } from '../services/chat.service';
import { OnEvent } from '@nestjs/event-emitter';
import { MessageSendedEvent } from '../events/message-sended.event';
import { MessageService } from '../services/message.service';
import { SendMessageDto } from '../dto/send-message.dto';
import { MessageResponseDto } from '../dto/message-response.dto';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from 'src/auth/guards/ws-jwt.guard';
import { ReadChatDto } from '../dto/read-chat.dto';
import { ChatUpdatedEvent } from '../events/chat-updated.event';

@WebSocketGateway({ cors: true, namespace: '/chats' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,

    private readonly messageService: MessageService,

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

  async handleConnection(client: Socket) {
    // console.log('Client connected:', client.id);
    const token = client.handshake.headers.authorization as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      const user = await this.userRepository.findOneBy({ id: payload.id });

      if (!user) {
        client.disconnect();
        return;
      }

      client.join(`user-${user.id}`);
      console.log(`Client ${client.id} joined user-${user.id} channel`);
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // console.log('Client disconnected:', client.id);
  }

  async emitMessageReceived(event: MessageSendedEvent) {
    const chat = event.chat;

    for (let userId of chat.usersId) {
      const room = `user-${userId}`;

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
        },
        chatId: event.message.chat.id,
      };

      this.server.to(room).emit('messageReceived', data);
    }
  }

  async emitChatUpdated(event: ChatUpdatedEvent) {
    const chat = event.chat;

    for (let userId of chat.usersId) {
      const room = `user-${userId}`;

      const chatUpdated = chatResource(chat, userId);

      this.server.to(room).emit('chatUpdated', chatUpdated);
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: SendMessageDto) {
    console.log(`Received message:`, payload);
    const sender = client['user'];
    return await this.messageService.sendMessage(payload, sender);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('markChatAsRead')
  async handleMarkChatAsRead(client: Socket, payload: ReadChatDto) {
    const sender = client['user'];
    return await this.messageService.readChat(payload, sender);
  }
}
