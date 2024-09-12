import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuth } from 'src/auth/decorators/jwt-auth.decorator';
import { CreateChatDto } from '../dto/create-chat.dto';
import { ChatService } from '../services/chat.service';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @JwtAuth()
  async createChat(
    @Body() createChatDto: CreateChatDto,
    @GetUser() user: User,
  ) {
    return this.chatService.createChat(createChatDto, user);
  }

  @Get(':chatId')
  @JwtAuth()
  async getChatById(@Param('chatId', ParseIntPipe) chatId: number) {
    return this.chatService.getChatById(chatId);
  }

  @Get()
  @JwtAuth()
  async getAllChats(@GetUser() user: User) {
    return this.chatService.getAllChats(user);
  }
}
