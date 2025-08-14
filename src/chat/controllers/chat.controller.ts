import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuth } from 'src/auth/decorators/jwt-auth.decorator';
import { User } from 'src/users/entities/user.entity';
import { ChatService } from '../services/chat.service';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @JwtAuth()
  async getAllChats(@GetUser() user: User) {
    return this.chatService.getAllChats(user);
  }

  @Post('/upload-file')
  @UseInterceptors(FileInterceptor('file'))
  @JwtAuth()
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.chatService.sendFile(file);
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
