import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { NotificationService } from 'src/notification/services/notification.service';
import { ArrayContains, IsNull, Repository } from 'typeorm';
import { MessageDeliveredRequestDto } from '../dto/message-delivered-request.dto';
import { ReadChatRequestDto } from '../dto/read-chat-request.dto';
import { SendMessageRequestDto } from '../dto/send-message-request.dto';
import { ChatUser } from '../entities/chat-user.entity';
import { Chat } from '../entities/chat.entity';
import { MessageUser } from '../entities/message-user.entity';
import { Message } from '../entities/message.entity';
import { ChatUpdatedEvent } from '../events/chat-updated.event';
import { chatResource } from '../resources/chat.resource';
import { MessageResource } from '../resources/message.resource';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,

    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    private eventEmitter: EventEmitter2,

    @InjectRepository(ChatUser)
    private chatUserRepository: Repository<ChatUser>,

    private notificationsService: NotificationService,

    @InjectRepository(MessageUser)
    private messageUserRepository: Repository<MessageUser>,
  ) {}

  async getAllChats(user: User) {
    const chats = await this.chatRepository.find({
      where: {
        usersId: ArrayContains([user.id]), // Verifica si el ID del usuario está contenido en el arreglo de usersId
      },
      order: {
        lastMessage: {
          sentAt: 'DESC',
        },
      },
      relations: {
        lastMessage: {
          sender: true,
          messageUsers: true,
          chat: true,
        },
        contacts: {
          targetContact: true,
        },
        chatUsers: {
          user: true,
        },
      },
    });

    this.markAllMessagesAsDelivered(user);

    return chats.map((chat) => {
      return chatResource(chat, user.id);
    });
  }

  async markAllMessagesAsDelivered(user: User) {
    const messageUsers = await this.messageUserRepository.find({
      where: {
        user: {
          id: user.id,
        },
        deliveredAt: IsNull(),
      },
      relations: {
        message: {
          sender: true,
          chat: true,
          messageUsers: true,
        },
      },
    });

    for (const messageUser of messageUsers) {
      messageUser.deliveredAt = new Date();
      await this.messageUserRepository.save(messageUser);

      const message = await this.messageRepository
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.sender', 'sender')
        .leftJoinAndSelect('message.chat', 'chat')
        .leftJoinAndSelect('message.messageUsers', 'messageUser')
        .where('message.id = :id', { id: messageUser.message.id })
        .getOne();

      this.eventEmitter.emit(
        'message.updated',
        new MessageResource(message!, messageUser.message.sender.id),
      );
    }
  }

  async sendMessage(params: SendMessageRequestDto, sender: User) {
    const { chatId, content, fileUrl, temporalId } = params;

    const chat = await this.chatRepository.findOne({
      where: {
        id: chatId,
      },
      relations: {
        chatUsers: {
          user: {
            fcmTokens: true,
          },
        },
        lastMessage: {
          sender: true,
          messageUsers: true,
          chat: true,
        },
        contacts: {
          targetContact: true,
        },
      },
    });

    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found.`);
    }

    // Crear y guardar el mensaje
    const message = this.messageRepository.create({
      content,
      sender,
      chat,
      fileUrl,
      messageUsers: [],
    });

    await this.messageRepository.save(message);

    chat.lastMessage = message;
    await this.chatRepository.update(chat.id, { lastMessage: message });

    // Incrementar los mensajes no leídos en los chatUsers (excepto para el remitente)
    const chatUsersToUpdate = chat.chatUsers.filter(
      (chatUser) => chatUser.user.id !== sender.id,
    );

    for (const chatUser of chatUsersToUpdate) {
      chatUser.unreadMessagesCount += 1;
      await this.chatUserRepository.save(chatUser);

      // Crear el MessageUser
      const messageUser = this.messageUserRepository.create();
      messageUser.message = message;
      messageUser.user = chatUser.user;

      await this.messageUserRepository.save(messageUser);

      message.messageUsers.push(messageUser);
    }

    this.notificationsService.sendMessage({
      users: chatUsersToUpdate.map((chatUser) => chatUser.user),
      title: `${sender.name} ${sender.surname}`,
      body: content ?? 'photo',
    });

    for (let userId of chat.usersId) {
      const messageResource = new MessageResource(message, userId, temporalId);

      this.eventEmitter.emit('message.updated', messageResource);
    }

    const chatUpdatedEvent = new ChatUpdatedEvent();
    chatUpdatedEvent.chat = chat;
    this.eventEmitter.emit('chat.updated', chatUpdatedEvent);

    // return new MessageResource(message, sender.id, temporalId).response;
  }

  async readChat(readChatDto: ReadChatRequestDto, user: User) {
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
          messageUsers: true,
          chat: true,
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

    this.readMessages(user, chat);

    // Emitir evento
    const chatUpdatedEvent = new ChatUpdatedEvent();
    chatUpdatedEvent.chat = chat;
    this.eventEmitter.emit('chat.updated', chatUpdatedEvent);
  }

  async getMessages(
    chatId: string,
    user: User,
    limit: number,
    lastMessageId?: string,
  ) {
    const query = this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender') // Incluir la relación con el sender
      .leftJoinAndSelect('message.chat', 'chat') // Incluir la relación con el chat
      .leftJoinAndSelect('message.messageUsers', 'messageUser') // Incluir la relación con MessageUser
      .where('message.chat_id = :id', { id: chatId })
      .orderBy('message.sentAt', 'DESC')
      .limit(limit);

    if (lastMessageId) {
      // Filtrar mensajes más antiguos que el último cargado
      const lastMessage = await this.messageRepository.findOne({
        where: {
          id: lastMessageId,
        },
      });

      if (!lastMessage) {
        throw new NotFoundException(
          `Message with ID ${lastMessageId} not found.`,
        );
      }

      query.andWhere('message.createdAt < :createdAt', {
        createdAt: lastMessage.createdAt,
      });
    }

    const messages = await query.getMany();
    return messages.map((message) => {
      return new MessageResource(message, user.id).response;
    });
  }

  async readMessages(user: User, chat: Chat) {
    // Lisar los mensajes no leídos
    const messageUsers = await this.messageUserRepository.find({
      where: {
        user: {
          id: user.id,
        },
        message: {
          chat: {
            id: chat.id,
          },
        },
        readAt: IsNull(),
      },
      relations: {
        message: true,
      },
    });

    // Marcar como leídos los mensajes no leídos
    for (const messageUser of messageUsers) {
      messageUser.readAt = new Date();
      await this.messageUserRepository.save(messageUser);

      const message = await this.messageRepository
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.sender', 'sender')
        .leftJoinAndSelect('message.chat', 'chat')
        .leftJoinAndSelect('message.messageUsers', 'messageUser')
        .where('message.id = :id', { id: messageUser.message.id })
        .getOne();

      this.eventEmitter.emit(
        'message.updated',
        new MessageResource(message!, message!.sender.id),
      );
    }
  }

  async messageDelivered(
    messageResource: MessageDeliveredRequestDto,
    receiver: User,
  ) {
    // Actualizar el messageUser del usuario que recibe el mensaje
    const messageUser = await this.messageUserRepository.findOne({
      where: {
        message: {
          id: messageResource.messageId,
        },
        user: {
          id: receiver.id,
        },
      },
    });

    if (!messageUser) return;

    messageUser.deliveredAt = new Date();

    await this.messageUserRepository.save(messageUser!);

    //Notificar al usuario emisor que el mensaje ha sido recibido

    const message = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.chat', 'chat')
      .leftJoinAndSelect('message.messageUsers', 'messageUser')
      .where('message.id = :id', { id: messageResource.messageId })
      .getOne();

    if (!message) return;

    this.eventEmitter.emit(
      'message.updated',
      new MessageResource(message, message.sender.id),
    );
  }
}
