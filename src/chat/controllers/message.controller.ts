import { Controller, Post, Body } from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { SendMessageDto } from '../dto/send-message.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuth } from 'src/auth/decorators/jwt-auth.decorator';
import { MessageService } from '../services/message.service';

@Controller('messages')
@JwtAuth()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('/')
  async sendMessage(
    @Body() sendMessageDto: SendMessageDto,
    @GetUser() sender: User,
  ) {
    return this.messageService.sendMessage(sendMessageDto, sender);
  }
}
