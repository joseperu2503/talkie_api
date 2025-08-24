import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ChatModule } from 'src/chat/chat.module';
import { ContactsModule } from 'src/contacts/contacts.module';
import { CountriesModule } from 'src/countries/countries.module';
import { UsersModule } from 'src/users/users.module';
import { ContactSeed } from './services/contact.seed';
import { CountrySeed } from './services/country.seed';
import { MessageSeed } from './services/message.seed';
import { SeedService } from './services/seed.service';
import { UserSeed } from './services/user.seed';

@Module({
  providers: [SeedService, UserSeed, CountrySeed, ContactSeed, MessageSeed],
  imports: [
    AuthModule,
    ContactsModule,
    CountriesModule,
    UsersModule,
    ChatModule,
  ],
  exports: [SeedService],
})
export class SeedModule {}
