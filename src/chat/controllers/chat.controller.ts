import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
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

  @Get(':chatId/messages')
  @JwtAuth()
  async getChatById(
    @GetUser() sender: User,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Param('chatId', ParseIntPipe) chatId: number,
  ) {
    return this.chatService.getMessagesByChat(chatId, page, limit, sender);
  }

  @Get()
  @JwtAuth()
  async getAllChats(@GetUser() user: User) {
    return this.chatService.getAllChats(user);
  }
}
