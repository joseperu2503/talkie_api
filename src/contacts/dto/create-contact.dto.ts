import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class CreateContactDto {
  @IsInt()
  @IsNotEmpty()
  contactId: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
