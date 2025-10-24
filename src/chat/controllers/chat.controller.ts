import {
  Controller,
  Get,
  Param,
  Query
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { ChatResponseDto } from '../dto/chat-response.dto';
import { MessageResponseDto } from '../dto/message-response.dto';
import { ChatService } from '../services/chat.service';

@ApiTags('Chats')
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({ summary: 'Get all chats' })
  @ApiOkResponse({
    type: ChatResponseDto,
    isArray: true,
  })
  @ApiBearerAuth()
  @Get()
  @Auth()
  async getAllChats(@GetUser() user: User) {
    return this.chatService.getAllChats(user);
  }

  @ApiOperation({ summary: 'Get messages' })
  @ApiOkResponse({
    type: MessageResponseDto,
    isArray: true,
  })
  @ApiParam({
    name: 'chatId',
    required: true,
    example: '0b724adb-5e9e-4de4-920a-b911fe2dc4b9',
  })
  @ApiParam({
    name: 'limit',
    required: false,
    example: 20,
  })
  @ApiParam({
    name: 'lastMessageId',
    required: false,
    example: '61b7ac6b-2f07-42be-8416-443aafcebf23',
  })
  @ApiBearerAuth()
  @Get(':chatId/messages')
  @Auth()
  async getMessages(
    @GetUser() user: User,
    @Param('chatId') chatId: string,
    @Query('limit') limit: number = 20, // Cantidad de mensajes por página
    @Query('lastMessageId') lastMessageId?: string, // ID del último mensaje cargado
  ) {
    return this.chatService.getMessages(chatId, user, limit, lastMessageId);
  }
}
