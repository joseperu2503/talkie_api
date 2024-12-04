import { Module } from '@nestjs/common';
import { CountriesService } from './services/countries.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';

@Module({
  providers: [CountriesService],
  imports: [TypeOrmModule.forFeature([Country])],
  exports: [CountriesService],
})
export class CountriesModule {}
