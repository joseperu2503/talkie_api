import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ChatService } from './services/chat.service';
import { ChatController } from './controllers/chat.controller';
import { ChatGateway } from './gateways/chat.gateway';
import { ChatUser } from './entities/chat-user.entity';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { MessageUser } from './entities/message-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, Message, ChatUser, MessageUser]),
    AuthModule,
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
    NotificationsModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
