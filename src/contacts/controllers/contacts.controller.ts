import { Controller, Post, Body, Get } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuth } from 'src/auth/decorators/jwt-auth.decorator';
import { ContactService } from '../services/contact.service';
import { AddContactDto } from '../dto/add-contact.dto';

@Controller('contacts')
@JwtAuth()
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('/')
  async addContact(
    @Body() addContactDto: AddContactDto,
    @GetUser() sender: User,
  ) {
    return this.contactService.addContact(addContactDto, sender);
  }

  @Get('/')
  async getContacts(@GetUser() user: User) {
    return this.contactService.getContacts(user);
  }
}
