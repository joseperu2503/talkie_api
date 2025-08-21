import { Body, Controller, Get, Post } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserEntity } from 'src/auth/entities/user.entity';
import { AddContactDto } from '../dto/add-contact.dto';
import { ContactService } from '../services/contact.service';

@Controller('contacts')
@Auth()
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('/')
  async addContact(
    @Body() addContactDto: AddContactDto,
    @GetUser() sender: UserEntity,
  ) {
    return this.contactService.addContact(addContactDto, sender);
  }

  @Get('/')
  async getContacts(@GetUser() user: UserEntity) {
    return this.contactService.getContacts(user);
  }
}
