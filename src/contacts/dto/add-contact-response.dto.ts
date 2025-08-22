import { ApiProperty } from '@nestjs/swagger';

export class AddContactResponseDto {
  @ApiProperty({
    example: 'Contact added successfully',
  })
  message: string;
}
