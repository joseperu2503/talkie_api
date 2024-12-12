import { Module } from '@nestjs/common';
import { CountriesService } from './services/countries.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { CountriesController } from './controllers/countries.controller';

@Module({
  providers: [CountriesService],
  imports: [TypeOrmModule.forFeature([Country])],
  controllers: [CountriesController],

  exports: [CountriesService],
})
export class CountriesModule {}
