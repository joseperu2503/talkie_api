import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from '../../auth/entities/user.entity';
import { UpdateProfileRequestDto } from '../dto/update-profile-request.dto';
import { AccountService } from '../services/account.service';

@ApiTags('Account')
@Controller('account')
@Auth()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Put('profile')
  updateProfile(
    @GetUser() user: User,
    @Body() request: UpdateProfileRequestDto,
  ) {
    return this.accountService.updateProfile(user, request);
  }

  @Get('profile')
  profile(@GetUser() user: User) {
    return this.accountService.profile(user.id);
  }
}
