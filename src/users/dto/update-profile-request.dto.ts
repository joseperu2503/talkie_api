import { PartialType } from '@nestjs/mapped-types';
import { RegisterRequestDto } from '../../auth/dto/register-request.dto';

export class UpdateProfileRequestDto extends PartialType(RegisterRequestDto) {}
