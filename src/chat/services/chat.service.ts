import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Chat } from '../entities/chat.entity';
import { CreateChatDto } from '../dto/create-chat.dto';
import { ChatUser } from '../entities/chat-user.entity';
import { Message } from '../entities/message.entity';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { timestamp } from 'rxjs';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(ChatUser)
    private readonly chatUserRepository: Repository<ChatUser>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async getMessagesByChat(
    chatId: number,
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

  async getAllChats(user: User) {
    const chats = await this.chatRepository
      .createQueryBuilder('chat')
      .innerJoinAndSelect('chat.chatUsers', 'chatUser') // Unimos con chatUser
      .innerJoinAndSelect('chatUser.user', 'user') // Unimos con todos los usuarios del chat
      .leftJoinAndSelect('chat.messages', 'messages') // Unimos con los mensajes del chat
      .leftJoinAndSelect('messages.sender', 'messageSender') // Unimos con el usuario que envió el mensaje
      .leftJoinAndSelect('chat.lastMessage', 'lastMessage') // Unimos con el último mensaje
      .leftJoinAndSelect('lastMessage.sender', 'lastMessageSender') // Unimos con el usuario que envió el último mensaje
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('chatUserSub.chat.id')
          .from(ChatUser, 'chatUserSub')
          .where('chatUserSub.user.id = :userId') // Filtramos los chats en los que participa el usuario actual
          .getQuery();
        return 'chat.id IN ' + subQuery;
      })
      .setParameter('userId', user.id) // Filtramos los chats en los que participa el usuario actual
      .orderBy('messages.timestamp', 'DESC') // Ordenamos por la fecha de los mensajes
      .getMany();

    return chats.map((chat) => {
      const receiver = chat.chatUsers
        .filter((chatUser) => chatUser.user.id !== user.id)
        .map((chatUser) => {
          return {
            id: chatUser.user.id,
            name: chatUser.user.name,
            surname: chatUser.user.surname,
            email: chatUser.user.email,
          };
        })[0];

      return {
        id: chat.id,
        lastMessage: {
          ...chat.lastMessage,
          isSender: chat.lastMessage.sender.id === user.id,
          sender: {
            id: chat.lastMessage.sender.id,
            name: chat.lastMessage.sender.name,
            surname: chat.lastMessage.sender.surname,
            email: chat.lastMessage.sender.email,
          },
        },
        messages: chat.messages.map((message) => {
          const { id, content, timestamp, sender } = message;
          return {
            id,
            content,
            timestamp,
            isSender: sender.id === user.id,
            sender: {
              id: sender.id,
              name: sender.name,
              surname: sender.surname,
              email: sender.email,
            },
          };
        }),
        receiver: receiver,
      };
    });
  }
}
