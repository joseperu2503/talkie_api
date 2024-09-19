import { Controller, Post, Body } from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuth } from 'src/auth/decorators/jwt-auth.decorator';
import { ContactService } from '../services/contact.service';
import { CreateContactsDto } from '../dto/create-contacts.dto';
import { AddContactDto } from '../dto/add-contact.dto';

@Controller('contacts')
@JwtAuth()
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('/multi')
  async addContacts(
    @Body() addContactsDto: CreateContactsDto,
    @GetUser() sender: User,
  ) {
    return this.contactService.addContacts(addContactsDto, sender);
  }

  @Post('/add')
  async addContact(
    @Body() addContactDto: AddContactDto,
    @GetUser() sender: User,
  ) {
    return this.contactService.addContact(addContactDto, sender);
  }
}
