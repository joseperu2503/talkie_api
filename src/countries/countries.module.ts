import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesController } from './controllers/countries.controller';
import { Country } from './entities/country.entity';
import { CountriesService } from './services/countries.service';

@Module({
  providers: [CountriesService],
  imports: [TypeOrmModule.forFeature([Country])],
  controllers: [CountriesController],

  exports: [CountriesService, TypeOrmModule],
})
export class CountriesModule {}
