import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor() {}

  @Get()
  index() {
    return 'Talkie API';
  }
}
