import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CountryModule } from 'src/country/country.module';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [AuthModule, CountryModule],
  exports: [UserService],
})
export class UserModule {}
