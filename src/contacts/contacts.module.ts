import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { ContactService } from './services/contact.service';
import { AuthModule } from 'src/auth/auth.module';
import { ContactController } from './controllers/contacts.controller';
import { Chat } from 'src/chat/entities/chat.entity';
import { ChatUser } from 'src/chat/entities/chat-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contact, Chat, ChatUser]), AuthModule],
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactsModule {}
