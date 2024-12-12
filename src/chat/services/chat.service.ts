import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayContains, IsNull, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Chat } from '../entities/chat.entity';
import { Message } from '../entities/message.entity';
import { chatResource } from '../resources/chat.resource';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChatUser } from '../entities/chat-user.entity';
import { SendMessageDto } from '../dto/send-message.dto';
import { ChatUpdatedEvent } from '../events/chat-updated.event';
import { MarkChatAsReadDto } from '../dto/mark-chat-as-read.dto';
import { extname } from 'path';
import { NotificationsService } from 'src/notifications/services/notifications.service';
import { MessageResource } from '../resources/message.resource';
import { MessageUser } from '../entities/message-user.entity';

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

    private notificationsService: NotificationsService,

    @InjectRepository(MessageUser)
    private messageUserRepository: Repository<MessageUser>,
  ) {
    const GCP_KEY_FILE_PATH = 'firebase-admin.json';

    this.storage = new Storage({
      keyFilename: GCP_KEY_FILE_PATH,
    });
  }

  private readonly storage: Storage;

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
        'message.delivered',
        new MessageResource(message!, messageUser.message.sender.id),
      );
    }
  }

  async ReadMessages(user: User, chat: Chat) {
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
        message: {
          sender: true,
          chat: true,
          messageUsers: true,
        },
      },
    });

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
        'message.read',
        new MessageResource(message!, messageUser.message.sender.id),
      );
    }
  }

  async uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const GCP_BUCKET = process.env.GCP_BUCKET ?? '';
    const fileExtension = extname(file.originalname);
    const blobName = `${uuidv4()}${fileExtension}`;
    const blob = this.storage.bucket(GCP_BUCKET).file(blobName);

    const blobStream = blob.createWriteStream({
      resumable: false,
      gzip: true,
    });

    blobStream.on('error', (err) => {
      throw new BadRequestException('Error uploading file');
    });

    // Espera a que el archivo esté completamente subido
    await new Promise<void>((resolve, reject) => {
      blobStream.on('finish', async () => {
        resolve();
      });

      // Envía el archivo al bucket
      blobStream.end(file.buffer);
    });

    // Devuelve la URL pública
    const publicUrl = `https://storage.googleapis.com/${GCP_BUCKET}/${blob.name}`;
    return publicUrl;
  }

  async sendFile(sender: User, file: Express.Multer.File, chatId: string) {
    if (!chatId) {
      throw new BadRequestException('No chatId');
    }

    const fileUrl = await this.uploadFile(file);

    return await this.sendMessageService(
      sender,
      chatId,
      null,
      fileUrl,
      'asasd',
    );
  }

  sendMessage(sendMessageDto: SendMessageDto, sender: User) {
    return this.sendMessageService(
      sender,
      sendMessageDto.chatId,
      sendMessageDto.content,
      null,
      sendMessageDto.temporalId,
    );
  }

  async sendMessageService(
    sender: User,
    chatId: string,
    content: string | null,
    fileUrl: string | null,
    temporalId: string,
  ) {
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
    await this.chatRepository.save(chat);

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
      body: content ?? 'foto',
    });

    for (let userId of chat.usersId) {
      const messageResource = new MessageResource(message, userId, temporalId);

      this.eventEmitter.emit('message.sent', messageResource);
    }

    const chatUpdatedEvent = new ChatUpdatedEvent();
    chatUpdatedEvent.chat = chat;
    this.eventEmitter.emit('chat.updated', chatUpdatedEvent);

    return new MessageResource(message, sender.id, temporalId).response;
  }

  async readChat(readChatDto: MarkChatAsReadDto, user: User) {
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

    this.ReadMessages(user, chat);

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

  async messageDelivered(messageResource: MessageResource) {
    const userId = messageResource.userId;

    const messageUser = await this.messageUserRepository.findOne({
      where: {
        message: {
          id: messageResource.message.id,
        },
        user: {
          id: userId,
        },
      },
    });

    messageUser!.deliveredAt = new Date();

    await this.messageUserRepository.save(messageUser!);

    const message = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.chat', 'chat')
      .leftJoinAndSelect('message.messageUsers', 'messageUser')
      .where('message.id = :id', { id: messageResource.message.id })
      .getOne();

    this.eventEmitter.emit(
      'message.delivered',
      new MessageResource(message!, messageResource.message.sender.id),
    );

    return new MessageResource(message!, userId);
  }
}
