import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayContains, Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Chat } from '../entities/chat.entity';
import { Message } from '../entities/message.entity';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { timestamp } from 'rxjs';

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
      },
    });

    return chats.map((chat) => {
      const receiver = chat.contacts
        .filter((contact) => contact.targetContact.id !== user.id)
        .map((contact) => {
          return {
            id: contact.targetContact.id,
            name: contact.targetContact.name,
            surname: contact.targetContact.surname,
            email: contact.targetContact.email,
          };
        })[0];

      return {
        id: chat.id,
        lastMessage: chat.lastMessage
          ? {
              ...chat.lastMessage,
              isSender: chat.lastMessage.sender.id === user.id,
              sender: {
                id: chat.lastMessage.sender.id,
                name: chat.lastMessage.sender.name,
                surname: chat.lastMessage.sender.surname,
                email: chat.lastMessage.sender.email,
              },
            }
          : null,
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
