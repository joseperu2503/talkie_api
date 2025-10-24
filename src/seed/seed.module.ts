import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ChatModule } from 'src/chat/chat.module';
import { ContactModule } from 'src/contact/contact.module';
import { CountryModule } from 'src/country/country.module';
import { UserModule } from 'src/user/user.module';
import { ContactSeed } from './services/contact.seed';
import { CountrySeed } from './services/country.seed';
import { MessageSeed } from './services/message.seed';
import { SeedService } from './services/seed.service';
import { UserSeed } from './services/user.seed';

@Module({
  providers: [SeedService, UserSeed, CountrySeed, ContactSeed, MessageSeed],
  imports: [
    AuthModule,
    ContactModule,
    CountryModule,
    UserModule,
    ChatModule,
  ],
  exports: [SeedService],
})
export class SeedModule {}
