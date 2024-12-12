import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { CountriesModule } from 'src/countries/countries.module';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([User]), AuthModule, CountriesModule],
  exports: [UsersService],
})
export class UsersModule {}
