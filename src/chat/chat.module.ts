import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MessageController } from './controllers/message.controller';
import { MessageService } from './services/message.service';
import { ChatService } from './services/chat.service';
import { ChatController } from './controllers/chat.controller';
import { ChatUser } from './entities/chat-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Message, ChatUser]), AuthModule],
  controllers: [ChatController, MessageController],
  providers: [ChatService, MessageService],
  exports: [ChatService, MessageService],
})
export class ChatModule {}
