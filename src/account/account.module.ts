import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CountryModule } from 'src/country/country.module';
import { AccountController } from './controllers/account.controller';
import { AccountService } from './services/account.service';

@Module({
  controllers: [AccountController],
  imports: [AuthModule, CountryModule],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
