import { Module } from '@nestjs/common';
import { SeedService } from './services/seed.service';
import { AuthModule } from 'src/auth/auth.module';
import { ContactsModule } from 'src/contacts/contacts.module';
import { CountriesModule } from 'src/countries/countries.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [SeedService],
  imports: [AuthModule, ContactsModule, CountriesModule, UsersModule],
  exports: [SeedService],
})
export class SeedModule {}
