import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { AuthModule } from 'src/auth/auth.module';
import { ContactsModule } from 'src/contacts/contacts.module';

@Module({
  providers: [SeedService],
  imports: [AuthModule, ContactsModule],
  exports: [SeedService],
})
export class SeedModule {}
