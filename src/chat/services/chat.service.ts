import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayContains, Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Chat } from '../entities/chat.entity';
import { Message } from '../entities/message.entity';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { chatResource } from '../resources/chat.resource';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChatUser } from '../entities/chat-user.entity';
import { SendMessageDto } from '../dto/send-message.dto';
import { MessageSendedEvent } from '../events/message-sended.event';
import { ChatUpdatedEvent } from '../events/chat-updated.event';
import { MarkChatAsReadDto } from '../dto/mark-chat-as-read.dto';
import { extname } from 'path';
import { NotificationsService } from 'src/notifications/services/notifications.service';
import { messageResource } from '../resources/message.resource';

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
          timestamp: 'DESC',
        },
      },
      relations: {
        lastMessage: {
          sender: true,
        },
        messages: {
          sender: true,
        },
        contacts: {
          targetContact: true,
        },
        chatUsers: {
          user: true,
        },
      },
    });

    return chats.map((chat) => {
      return chatResource(chat, user.id);
    });
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

    return await this.sendMessageService(sender, chatId, null, fileUrl);
  }

  sendMessage(sendMessageDto: SendMessageDto, sender: User) {
    return this.sendMessageService(
      sender,
      sendMessageDto.chatId,
      sendMessageDto.content,
      null,
    );
  }

  async sendMessageService(
    sender: User,
    chatId: string,
    content: string | null,
    fileUrl: string | null,
  ) {
    let chat = await this.chatRepository.findOne({
      where: {
        id: chatId,
      },
      relations: {
        chatUsers: {
          user: {
            fcmTokens: true,
          },
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

    this.notificationsService.sendMessage({
      users: chatUsersToUpdate.map((chatUser) => chatUser.user),
      title: `${sender.name} ${sender.surname}`,
      body: content ?? 'foto',
    });

    chat = await this.chatRepository.findOne({
      where: {
        id: chatId,
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

  async markChatAsReadDto(readChatDto: MarkChatAsReadDto, user: User) {
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
  }

  async getMessagesByChat(
    chatId: string,
    page: number,
    limit: number,
    sender: User,
  ) {
    const queryBuilder = this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender') // Incluir la relación con el sender
      .where('message.chat_id = :id', { id: chatId })
      .orderBy('message.timestamp', 'DESC');

    const messages = await paginate<Message>(queryBuilder, { page, limit });

    return new Pagination(
      messages.items.map((message) => {
        return {
          ...message,
          sender: {
            id: message.sender.id,
            name: message.sender.name,
          },
          isSender: message.sender.id === sender.id,
        };
      }),
      messages.meta,
    );
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
      .where('message.chat_id = :id', { id: chatId })
      .orderBy('message.timestamp', 'DESC')
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
      return messageResource(message, user.id);
    });
  }
}
