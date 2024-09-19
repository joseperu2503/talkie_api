import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { In, Repository } from 'typeorm';
import { Contact } from '../entities/contact.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateContactsDto } from '../dto/create-contacts.dto';
import { CreateContactDto } from '../dto/create-contact.dto';
import { AddContactDto } from '../dto/add-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
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
          user: {
            id: user.id,
          },
          contact: {
            id: contactDto.contactId,
          },
        },
      });

      if (existContact) {
        existContact.alias = contactDto.alias;
        newContacts.push(existContact);
      } else {
        const contact = this.contactRepository.create(contactDto);
        contact.user = user;
        contact.contact = contactUser;

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
        user: {
          id: user.id,
        },
        contact: {
          id: contactUser.id,
        },
      },
    });

    // Si el contacto ya existe, retornar mensaje de conflicto
    if (existContact) {
      throw new ConflictException(`Contact already exists.`);
    }

    // Crear el nuevo contacto
    const newContact = this.contactRepository.create();
    newContact.user = user;
    newContact.contact = contactUser;

    // Guardar el nuevo contacto
    await this.contactRepository.save(newContact);

    return { message: 'Contact added successfully' };
  }
}
