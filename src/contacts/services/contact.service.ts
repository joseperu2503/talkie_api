import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthMethod } from 'src/auth/dto/login-request.dto';
import { ChatUser } from 'src/chat/entities/chat-user.entity';
import { Chat } from 'src/chat/entities/chat.entity';
import { ChatUpdatedEvent } from 'src/chat/events/chat-updated.event';
import { User } from 'src/users/entities/user.entity';
import { ArrayContains, Repository } from 'typeorm';
import { AddContactDto } from '../dto/add-contact.dto';
import { ContactResourceDto } from '../dto/contact-resource.dto';
import { Contact } from '../entities/contact.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,

    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,

    @InjectRepository(ChatUser)
    private chatUserRepository: Repository<ChatUser>,

    private eventEmitter: EventEmitter2,
  ) {}

  async addContact(
    addContactDto: AddContactDto,
    user: User,
    withSocket: boolean = true,
  ) {
    const { email, phone, type } = addContactDto;

    let contactUser: User | null = null;

    if (type == AuthMethod.EMAIL) {
      // Buscar el usuario con el email proporcionado
      contactUser = await this.userRepository.findOne({
        where: {
          email: email,
        },
      });
    } else {
      // Buscar el usuario con el phone proporcionado

      const phoneProcessed = phone!.number.replaceAll(' ', '');

      contactUser = await this.userRepository.findOne({
        where: {
          phone: phoneProcessed,
          phoneCountry: { id: phone!.countryId },
        },
      });
    }

    // Lanzar error si el usuario a agregar no existe
    if (!contactUser) {
      throw new NotFoundException(`User not found.`);
    }

    // Lanzar error si el usuario a agregar es el mismo que el usuario
    if (contactUser.id == user.id) {
      throw new ConflictException(`Cannot add yourself as a contact.`);
    }

    // Verificar si ya existe el contacto
    const existContact = await this.contactRepository.findOne({
      where: {
        ownerUser: {
          id: user.id,
        },
        targetContact: {
          id: contactUser.id,
        },
      },
    });

    // Si el contacto ya existe, retornar mensaje de conflicto
    if (existContact) {
      throw new ConflictException(`Contact already exists.`);
    }

    // Verificar si ya existe un chat entre ambos usuarios
    let chat = await this.chatRepository.findOne({
      where: {
        usersId: ArrayContains([user.id, contactUser.id]),
      },
    });

    // Si no existe el chat, crearlo
    if (!chat) {
      chat = this.chatRepository.create();
      chat.usersId = [user.id, contactUser.id]; // Guardar los IDs de los usuarios en el array

      // Guardar el nuevo chat
      await this.chatRepository.save(chat);
    }

    // Guardar el nuevo chat
    await this.chatRepository.save(chat);

    // Crear los ChatUser
    const chatUser1 = this.chatUserRepository.create();
    chatUser1.chat = chat;
    chatUser1.user = contactUser;

    const chatUser2 = this.chatUserRepository.create();
    chatUser2.chat = chat;
    chatUser2.user = user;

    await this.chatUserRepository.save([chatUser1, chatUser2]);

    // Crear el nuevo contacto
    const contact1 = this.contactRepository.create();
    contact1.ownerUser = user;
    contact1.targetContact = contactUser;
    contact1.chat = chat;

    const contact2 = this.contactRepository.create();
    contact2.ownerUser = contactUser;
    contact2.targetContact = user;
    contact2.chat = chat;

    // Guardar el nuevo contacto
    await this.contactRepository.save([contact1, contact2]);

    if (withSocket) {
      chat = await this.chatRepository.findOne({
        where: {
          usersId: ArrayContains([user.id, contactUser.id]),
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

      //notificar por sockets
      const chatUpdatedEvent = new ChatUpdatedEvent();
      chatUpdatedEvent.chat = chat!;
      this.eventEmitter.emit('chat.updated', chatUpdatedEvent);
    }

    return { message: 'Contact added successfully' };
  }

  async getContacts(user: User): Promise<ContactResourceDto[]> {
    const contacts = await this.contactRepository.find({
      where: {
        ownerUser: {
          id: user.id,
        },
      },
      relations: {
        targetContact: true,
        chat: true,
      },
    });

    return contacts.map((contact) => {
      return {
        id: contact.targetContact.id,
        name: contact.targetContact.name,
        surname: contact.targetContact.surname,
        photo: contact.targetContact.photo,
        phone: contact.targetContact.phone,
        email: contact.targetContact.email,
        isConnected: contact.targetContact.isConnected,
        lastConnection: contact.targetContact.lastConnection,
        chatId: contact.chat.id,
      };
    });
  }
}
