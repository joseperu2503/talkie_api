import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CountriesModule } from 'src/countries/countries.module';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [AuthModule, CountriesModule],
  exports: [UsersService],
})
export class UsersModule {}
