import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/auth/entities/user.entity';
import { ContactService } from 'src/contact/services/contact.service';
import { AuthMethod } from 'src/core/models/auth-method';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class ContactSeed {
  constructor(
    private readonly contactService: ContactService,
    private readonly usersService: UserService,
  ) {}

  contacts: ContactSeedData[] = [
    {
      email: 'test2@gmail.com',
      phone: null,
      type: AuthMethod.EMAIL,
    },
    {
      email: 'test3@gmail.com',
      phone: null,
      type: AuthMethod.EMAIL,
    },
    {
      email: 'test4@gmail.com',
      phone: null,
      type: AuthMethod.EMAIL,
    },
    {
      email: 'test5@gmail.com',
      phone: null,
      type: AuthMethod.EMAIL,
    },
    {
      email: 'test6@gmail.com',
      phone: null,
      type: AuthMethod.EMAIL,
    },
    {
      email: 'test7@gmail.com',
      phone: null,
      type: AuthMethod.EMAIL,
    },
    {
      email: 'test8@gmail.com',
      phone: null,
      type: AuthMethod.EMAIL,
    },
  ];

  async run() {
    const contacts = this.contacts;
    const user: UserEntity | null = await this.usersService.findOne(
      '578414e1-f1cd-490b-a92b-767899a0d780',
    );

    if (!user) return;
    for (const contact of contacts) { 
      await this.contactService.addContact(contact, user, false);
    }
  }
}

interface ContactSeedData {
  email: string;
  phone: null;
  type: AuthMethod;
}
