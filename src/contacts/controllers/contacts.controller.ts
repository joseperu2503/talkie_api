import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { AuthMethod } from 'src/auth/dto/login-request.dto';
import { UserEntity } from 'src/auth/entities/user.entity';
import { AddContactRequestDto } from '../dto/add-contact-request.dto';
import { AddContactResponseDto } from '../dto/add-contact-response.dto';
import { ContactResponseDto } from '../dto/contact-response.dto';
import { ContactService } from '../services/contact.service';

@ApiTags('Contacts')
@Controller('contacts')
@Auth()
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @ApiOperation({ summary: 'Add a contact' })
  @ApiBody({
    type: AddContactRequestDto,
    examples: {
      emailExample: {
        summary: 'Add a contact with email',
        value: {
          type: AuthMethod.EMAIL,
          email: 'test1@gmail.com',
          phone: null,
        },
      },
      phoneExample: {
        summary: 'Add a contact with phone',
        value: {
          type: AuthMethod.PHONE,
          email: null,
          phone: {
            number: '+1234567890',
            countryId: 1,
          },
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Contact added successfully',
    type: AddContactResponseDto,
  })
  @ApiBearerAuth()
  @Post('/')
  async addContact(
    @Body() addContactDto: AddContactRequestDto,
    @GetUser() sender: UserEntity,
  ) {
    return this.contactService.addContact(addContactDto, sender);
  }

  @ApiOperation({ summary: 'Get contacts' })
  @ApiOkResponse({
    description: 'List of contacts',
    type: ContactResponseDto,
    isArray: true,
  })
  @ApiBearerAuth()
  @Get('/')
  async getContacts(@GetUser() user: UserEntity) {
    return this.contactService.getContacts(user);
  }
}
