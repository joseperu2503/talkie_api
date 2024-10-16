import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayContains, Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Chat } from '../entities/chat.entity';
import { Message } from '../entities/message.entity';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,

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
}

export const chatResource = (chat: Chat, userId: number) => {
  const receiver = chat.contacts
    .filter((contact) => contact.targetContact.id !== userId)
    .map((contact) => {
      return {
        id: contact.targetContact.id,
        name: contact.targetContact.name,
        surname: contact.targetContact.surname,
        email: contact.targetContact.email,
        photo: contact.targetContact.photo,
      };
    })[0];

  // Encontrar el ChatUser correspondiente al usuario actual
  const currentChatUser = chat.chatUsers.find(
    (chatUser) => chatUser.user.id === userId,
  );

  return {
    id: chat.id,
    lastMessage: chat.lastMessage
      ? {
          ...chat.lastMessage,
          isSender: chat.lastMessage.sender.id === userId,
          sender: {
            id: chat.lastMessage.sender.id,
            name: chat.lastMessage.sender.name,
            surname: chat.lastMessage.sender.surname,
            email: chat.lastMessage.sender.email,
            photo: chat.lastMessage.sender.photo,
          },
        }
      : null,
    messages: chat.messages.reverse().map((message) => {
      const { id, content, timestamp, sender } = message;
      return {
        id,
        content,
        timestamp,
        isSender: sender.id === userId,
        sender: {
          id: sender.id,
          name: sender.name,
          surname: sender.surname,
          email: sender.email,
          photo: sender.photo,
        },
      };
    }),
    receiver: receiver,
    unreadMessagesCount: currentChatUser
      ? currentChatUser.unreadMessagesCount
      : 0,
  };
};
