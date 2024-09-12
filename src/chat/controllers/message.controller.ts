import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
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
    @Param('chatId', ParseIntPipe) chatId: number,
    @Body() sendMessageDto: SendMessageDto,
    @GetUser() sender: User,
  ) {
    return this.messageService.sendMessageToChat(
      chatId,
      sendMessageDto,
      sender,
    );
  }

  @Get(':chatId')
  async getMessages(@Param('chatId', ParseIntPipe) chatId: number) {
    return this.messageService.getMessages(chatId);
  }

  @Post('/recipient/:recipientId')
  async sendMessageToUser(
    @Param('recipientId', ParseIntPipe) recipientId: number,
    @Body() sendMessageDto: SendMessageDto,
    @GetUser() sender: User,
  ) {
    return this.messageService.sendMessageToUser(
      recipientId,
      sendMessageDto,
      sender,
    );
  }
}
