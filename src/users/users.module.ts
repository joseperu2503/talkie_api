import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Country } from 'src/countries/entities/country.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([User, Country]), AuthModule],
  exports: [UsersService],
})
export class UsersModule {}
