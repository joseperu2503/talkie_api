import { Controller, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { SendMessageDto } from '../dto/send-message.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuth } from 'src/auth/decorators/jwt-auth.decorator';
import { MessageService } from '../services/message.service';

@Controller('messages')
@JwtAuth()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('/chat/:chatId')
  async sendMessage(
    @Param('chatId') chatId: string,
    @Body() sendMessageDto: SendMessageDto,
    @GetUser() sender: User,
  ) {
    return this.messageService.sendMessageToChat(
      chatId,
      sendMessageDto,
      sender,
    );
  }

  @Post('/recipient')
  async sendMessageToUser(
    @Body() sendMessageDto: SendMessageDto,
    @GetUser() sender: User,
  ) {
    return this.messageService.sendMessageToUser(sendMessageDto, sender);
  }
}
