import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Message } from '../entities/message.entity';
import { Chat } from '../entities/chat.entity';
import { SendMessageDto } from '../dto/send-message.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessageSendedEvent } from '../events/message-sended.event';
import { ChatUser } from '../entities/chat-user.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,

    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,

    private eventEmitter: EventEmitter2,

    @InjectRepository(ChatUser)
    private chatUserRepository: Repository<ChatUser>,
  ) {}

  async sendMessage(sendMessageDto: SendMessageDto, sender: User) {
    const chat = await this.chatRepository.findOne({
      where: {
        id: sendMessageDto.chatId,
      },
      relations: {
        chatUsers: {
          user: true,
        },
      },
    });

    if (!chat) {
      throw new NotFoundException(
        `Chat with ID ${sendMessageDto.chatId} not found.`,
      );
    }

    // Crear y guardar el mensaje
    const message = this.messageRepository.create({
      ...sendMessageDto,
      sender,
      chat,
    });

    await this.messageRepository.save(message);
    chat.lastMessage = message;
    await this.chatRepository.save(chat!);

    // Incrementar los mensajes no leídos en los chatUsers (excepto para el remitente)
    const chatUsersToUpdate = chat.chatUsers.filter(
      (chatUser) => chatUser.user.id !== sender.id,
    );

    for (const chatUser of chatUsersToUpdate) {
      chatUser.unreadMessagesCount += 1;
      await this.chatUserRepository.save(chatUser);
    }

    const messageSendedEvent = new MessageSendedEvent();
    messageSendedEvent.message = message;
    messageSendedEvent.usersId = chat.usersId;

    this.eventEmitter.emit('message.sended', messageSendedEvent);

    return message;
  }
}
