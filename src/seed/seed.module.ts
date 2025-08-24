import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ContactsModule } from 'src/contacts/contacts.module';
import { CountriesModule } from 'src/countries/countries.module';
import { UsersModule } from 'src/users/users.module';
import { ContactSeed } from './services/contact.seed';
import { CountrySeed } from './services/country.seed';
import { SeedService } from './services/seed.service';
import { UserSeed } from './services/user.seed';

@Module({
  providers: [SeedService, UserSeed, CountrySeed, ContactSeed],
  imports: [AuthModule, ContactsModule, CountriesModule, UsersModule],
  exports: [SeedService],
})
export class SeedModule {}
