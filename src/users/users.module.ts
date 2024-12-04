import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Country } from 'src/countries/entities/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Country])],
})
export class UsersModule {}
