import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { ArrayContains, Repository } from 'typeorm';
import { Contact } from '../entities/contact.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateContactsDto } from '../dto/create-contacts.dto';
import { AddContactDto } from '../dto/add-contact.dto';
import { Chat } from 'src/chat/entities/chat.entity';
import { ChatUser } from 'src/chat/entities/chat-user.entity';
import { ContactResourceDto } from '../dto/contact-resource.dto';
import { ContactUpdatedEvent } from 'src/chat/events/contact-updated.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChatUpdatedEvent } from 'src/chat/events/chat-updated.event';

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

  async addContacts(createContactsDto: CreateContactsDto, user: User) {
    // Verificar que ningún contactId sea igual al id del usuario actual
    const invalidContactDtos = createContactsDto.contacts.filter(
      (contactDto) => contactDto.contactId === user.id,
    );

    if (invalidContactDtos.length > 0) {
      throw new ConflictException(`Cannot add yourself as a contact.`);
    }

    const newContacts: Contact[] = [];

    for (const contactDto of createContactsDto.contacts) {
      const contactUser = await this.userRepository.findOne({
        where: {
          id: contactDto.contactId,
        },
      });

      if (!contactUser) {
        throw new NotFoundException('One or more contact IDs are invalid.');
      }

      const existContact = await this.contactRepository.findOne({
        where: {
          ownerUser: {
            id: user.id,
          },
          targetContact: {
            id: contactDto.contactId,
          },
        },
      });

      if (existContact) {
        existContact.alias = contactDto.alias;
        newContacts.push(existContact);
      } else {
        const contact = this.contactRepository.create(contactDto);
        contact.ownerUser = user;
        contact.targetContact = contactUser;

        newContacts.push(contact);
      }
    }

    await this.contactRepository.save(newContacts);

    return { message: 'Contacts added successfully' };
  }

  async addContact(addContactDto: AddContactDto, user: User) {
    // Verificar que el username no sea el del usuario actual
    if (addContactDto.username === user.username) {
      throw new ConflictException(`Cannot add yourself as a contact.`);
    }

    // Buscar el usuario con el username proporcionado
    const contactUser = await this.userRepository.findOne({
      where: {
        username: addContactDto.username,
      },
    });

    // Verificar si el usuario existe
    if (!contactUser) {
      throw new NotFoundException(
        `User with username ${addContactDto.username} not found.`,
      );
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

    const chatUpdatedEvent = new ChatUpdatedEvent();
    chatUpdatedEvent.chat = chat!;
    this.eventEmitter.emit('chat.updated', chatUpdatedEvent);

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
        lastConnection: new Date(),
        chatId: contact.chat.id,
      };
    });
  }
}
