import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuth } from 'src/auth/decorators/jwt-auth.decorator';
import { User } from 'src/users/entities/user.entity';
import { SendMessageRequestDto } from '../dto/send-message-request.dto';
import { ChatService } from '../services/chat.service';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @JwtAuth()
  async getAllChats(@GetUser() user: User) {
    return this.chatService.getAllChats(user);
  }

  @Post('/send/message')
  @JwtAuth()
  async sendMessage(
    @Body() sendMessageDto: SendMessageRequestDto,
    @GetUser() sender: User,
  ) {
    return this.chatService.sendMessage(sendMessageDto, sender);
  }

  @Post('/send/file')
  @UseInterceptors(FileInterceptor('file'))
  @JwtAuth()
  async uploadFile(
    @GetUser() sender: User,
    @UploadedFile() file: Express.Multer.File,
    @Body('chatId') chatId: string,
  ) {
    return this.chatService.sendFile(sender, file, chatId);
  }

  @Get(':chatId/messages')
  @JwtAuth()
  async getMessages(
    @GetUser() user: User,
    @Param('chatId') chatId: string,
    @Query('limit') limit: number = 20, // Cantidad de mensajes por página
    @Query('lastMessageId') lastMessageId?: string, // ID del último mensaje cargado
  ) {
    return this.chatService.getMessages(chatId, user, limit, lastMessageId);
  }
}
