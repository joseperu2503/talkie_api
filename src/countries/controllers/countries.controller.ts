import { Controller, Get } from '@nestjs/common';
import { CountriesService } from '../services/countries.service';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async getAllCountries() {
    return this.countriesService.getAllCountries();
  }
}
