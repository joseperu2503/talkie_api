import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Message } from '../entities/message.entity';
import { Chat } from '../entities/chat.entity';
import { SendMessageDto } from '../dto/send-message.dto';
import { AuthService } from 'src/auth/auth.service';
import { ChatUser } from '../entities/chat-user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessageSendedEvent } from '../events/message-sended.event';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,

    private readonly userService: AuthService,

    @InjectRepository(ChatUser)
    private chatUserRepository: Repository<ChatUser>,
    private eventEmitter: EventEmitter2,
  ) {}

  async sendMessageToChat(
    chatId: number,
    sendMessageDto: SendMessageDto,
    sender: User,
  ): Promise<Message> {
    const chat = await this.chatRepository.findOne({ where: { id: chatId } });
    if (!chat) {
      throw new NotFoundException();
    }
    const message = this.messageRepository.create({
      ...sendMessageDto,
      sender: sender,
      chat,
    });
    return this.messageRepository.save(message);
  }

  async sendMessageToUser(
    recipientId: number,
    sendMessageDto: SendMessageDto,
    sender: User,
  ) {
    // Verificar que el destinatario exista
    const recipient = await this.userService.findOne(recipientId);
    if (!recipient) {
      throw new NotFoundException('Recipient user not found');
    }

    let chat = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.chatUsers', 'chatUser')
      .leftJoin('chatUser.user', 'user')
      .select([
        'chat.id AS chatId',
        'array_agg(user.id) AS userIds', // Agrega los userIds en un array
      ])
      .groupBy('chat.id')
      .having(
        'ARRAY[CAST(:senderId AS integer), CAST(:recipientId AS integer)] <@ array_agg(user.id)',
      )
      .andHaving(
        'array_agg(user.id) <@ ARRAY[CAST(:senderId AS integer), CAST(:recipientId AS integer)]',
      )
      .setParameters({ senderId: sender.id, recipientId: recipientId })
      .getRawOne(); // Usamos getRawOne para obtener un solo chat

    // Si no existe un chat, crear uno nuevo
    if (!chat) {
      // Crear el nuevo chat
      chat = this.chatRepository.create();
      await this.chatRepository.save(chat);

      // Crear las relaciones entre el chat y los usuarios
      const chatUsers = [
        this.chatUserRepository.create({ chat, user: sender }),
        this.chatUserRepository.create({ chat, user: recipient }),
      ];
      await this.chatUserRepository.save(chatUsers);
    } else {
      const chatId = chat.id;
      chat = await this.chatRepository.findOne({ where: { id: chatId } });
    }

    // Crear y guardar el mensaje
    const message = this.messageRepository.create({
      ...sendMessageDto,
      sender,
      chat,
    });
    await this.messageRepository.save(message);
    chat!.lastMessage = message;
    await this.chatRepository.save(chat!);

    const messageSendedEvent = new MessageSendedEvent();
    messageSendedEvent.message = message;
    messageSendedEvent.users = [recipient];

    this.eventEmitter.emit('message.sended', messageSendedEvent);

    return message;
  }

  async getMessages(chatId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { chat: { id: chatId } },
      relations: ['user', 'chat'],
      order: { timestamp: 'ASC' },
    });
  }
}
