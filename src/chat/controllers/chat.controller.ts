import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserEntity } from 'src/auth/entities/user.entity';
import { ChatResponseDto } from '../dto/chat-response.dto';
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
  async getAllChats(@GetUser() user: UserEntity) {
    return this.chatService.getAllChats(user);
  }

  @Post('/upload-file')
  @UseInterceptors(FileInterceptor('file'))
  @Auth()
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.chatService.uploadFile(file);
  }

  @Get(':chatId/messages')
  @Auth()
  async getMessages(
    @GetUser() user: UserEntity,
    @Param('chatId') chatId: string,
    @Query('limit') limit: number = 20, // Cantidad de mensajes por página
    @Query('lastMessageId') lastMessageId?: string, // ID del último mensaje cargado
  ) {
    return this.chatService.getMessages(chatId, user, limit, lastMessageId);
  }
}
