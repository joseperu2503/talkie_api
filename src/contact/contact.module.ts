import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ChatUser } from 'src/chat/entities/chat-user.entity';
import { Chat } from 'src/chat/entities/chat.entity';
import { ContactController } from './controllers/contact.controller';
import { Contact } from './entities/contact.entity';
import { ContactService } from './services/contact.service';

@Module({
  imports: [TypeOrmModule.forFeature([Contact, Chat, ChatUser]), AuthModule],
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}
