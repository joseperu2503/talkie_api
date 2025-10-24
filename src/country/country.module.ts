import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryController } from './controllers/country.controller';
import { Country } from './entities/country.entity';
import { CountryService } from './services/country.service';

@Module({
  providers: [CountryService],
  imports: [TypeOrmModule.forFeature([Country])],
  controllers: [CountryController],

  exports: [CountryService, TypeOrmModule],
})
export class CountryModule {}
