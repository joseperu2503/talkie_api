import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Message } from '../entities/message.entity';
import { Chat } from '../entities/chat.entity';
import { SendMessageDto } from '../dto/send-message.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessageSendedEvent } from '../events/message-sended.event';
import { ChatUser } from '../entities/chat-user.entity';
import { ReadChatDto } from '../dto/read-chat.dto';
import { ChatUpdatedEvent } from '../events/chat-updated.event';

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
    let chat = await this.chatRepository.findOne({
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
    await this.chatRepository.save(chat);

    // Incrementar los mensajes no leídos en los chatUsers (excepto para el remitente)
    const chatUsersToUpdate = chat.chatUsers.filter(
      (chatUser) => chatUser.user.id !== sender.id,
    );

    for (const chatUser of chatUsersToUpdate) {
      chatUser.unreadMessagesCount += 1;
      await this.chatUserRepository.save(chatUser);
    }

    chat = await this.chatRepository.findOne({
      where: {
        id: sendMessageDto.chatId,
      },
      relations: {
        chatUsers: {
          user: true,
        },
        lastMessage: {
          sender: true,
        },
        messages: {
          sender: true,
        },
        contacts: {
          targetContact: true,
        },
      },
    });

    const messageSendedEvent = new MessageSendedEvent();
    messageSendedEvent.message = message;
    messageSendedEvent.chat = chat!;

    this.eventEmitter.emit('message.sended', messageSendedEvent);

    const chatUpdatedEvent = new ChatUpdatedEvent();
    chatUpdatedEvent.chat = chat!;
    this.eventEmitter.emit('chat.updated', chatUpdatedEvent);

    return message;
  }

  async readChat(readChatDto: ReadChatDto, user: User) {
    // Obtener el chat con las relaciones necesarias
    const chat = await this.chatRepository.findOne({
      where: {
        id: readChatDto.chatId,
      },
      relations: {
        chatUsers: {
          user: true,
        },
        lastMessage: {
          sender: true,
        },
        messages: {
          sender: true,
        },
        contacts: {
          targetContact: true,
        },
      },
    });

    if (!chat) {
      throw new NotFoundException(
        `Chat with ID ${readChatDto.chatId} not found.`,
      );
    }

    // Encontrar el chatUser correspondiente al usuario que está leyendo el chat
    const chatUser = chat.chatUsers.find((cu) => cu.user.id === user.id);

    if (!chatUser) {
      throw new UnauthorizedException(
        'You are not a participant in this chat.',
      );
    }

    // Marcar como leídos los mensajes no leídos
    chatUser.unreadMessagesCount = 0;
    await this.chatUserRepository.save(chatUser);

    // Emitir evento
    const chatUpdatedEvent = new ChatUpdatedEvent();
    chatUpdatedEvent.chat = chat;
    this.eventEmitter.emit('chat.updated', chatUpdatedEvent);

    return {
      message: 'Chat marked as read',
    };
  }
}
