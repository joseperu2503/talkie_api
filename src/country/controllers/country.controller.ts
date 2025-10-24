import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CountryResponseDto } from '../dto/country-response.dto';
import { CountryService } from '../services/country.service';

@ApiTags('Countries')
@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @ApiOperation({ summary: 'Get all countries' })
  @ApiOkResponse({
    type: CountryResponseDto,
    isArray: true,
  })
  @Get()
  async getAllCountries() {
    return this.countryService.getAllCountries();
  }
}
