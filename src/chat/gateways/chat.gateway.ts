import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interfaces';
import { ChatService } from '../services/chat.service';
import { OnEvent } from '@nestjs/event-emitter';
import { MessageSendedEvent } from '../events/message-sended.event';

@WebSocketGateway({ cors: true, namespace: '/chats' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  @OnEvent('message.sended')
  handleMessageSendedEvent(event: MessageSendedEvent) {
    this.emitMessageReceived(event);
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

  //** Método para emitir el estado de la orden a todos los clientes en el canal */
  async emitMessageReceived(event: MessageSendedEvent) {
    // console.log(`emit orden ${order.id} actualizada ${order.orderStatus.name}`);

    for (let user of event.users) {
      const room = `user-${user.id}`;
      this.server.to(room).emit('emitMessageReceived', event.message);
    }
  }
}
