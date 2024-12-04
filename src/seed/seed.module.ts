import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { AuthModule } from 'src/auth/auth.module';
import { ContactsModule } from 'src/contacts/contacts.module';
import { CountriesModule } from 'src/countries/countries.module';

@Module({
  providers: [SeedService],
  imports: [AuthModule, ContactsModule, CountriesModule],
  exports: [SeedService],
})
export class SeedModule {}
