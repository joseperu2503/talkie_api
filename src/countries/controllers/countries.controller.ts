import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CountriesService } from '../services/countries.service';

@ApiTags('Countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async getAllCountries() {
    return this.countriesService.getAllCountries();
  }
}
