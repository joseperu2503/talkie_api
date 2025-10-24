import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as multer from 'multer';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationsModule } from 'src/notification/notification.module';
import { UserModule } from 'src/user/user.module';
import { ChatController } from './controllers/chat.controller';
import { ChatUser } from './entities/chat-user.entity';
import { Chat } from './entities/chat.entity';
import { MessageUser } from './entities/message-user.entity';
import { Message } from './entities/message.entity';
import { ChatGateway } from './gateways/chat.gateway';
import { ChatService } from './services/chat.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, Message, ChatUser, MessageUser]),
    AuthModule,
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
    NotificationsModule,
    UserModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService, TypeOrmModule],
})
export class ChatModule {}
