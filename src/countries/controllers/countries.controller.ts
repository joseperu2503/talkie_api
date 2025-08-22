import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CountryResponseDto } from '../dto/country-response.dto';
import { CountriesService } from '../services/countries.service';

@ApiTags('Countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @ApiOperation({ summary: 'Get all countries' })
  @ApiOkResponse({
    type: CountryResponseDto,
    isArray: true,
  })
  @Get()
  async getAllCountries() {
    return this.countriesService.getAllCountries();
  }
}
