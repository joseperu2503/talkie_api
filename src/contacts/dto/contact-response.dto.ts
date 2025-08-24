import { ApiProperty } from '@nestjs/swagger';

export class ContactResponseDto {
  @ApiProperty({
    example: 1,
  })
  id: string;

  @ApiProperty({
    example: 'John',
  })
  name: string;

  @ApiProperty({
    example: 'Doe',
  })
  surname: string;

  @ApiProperty({
    example: 'https://example.com/photo.jpg',
    nullable: true,
    type: String,
  })
  photo: string | null;

  @ApiProperty({
    example: '+1234567890',
    nullable: true,
    type: String,
  })
  phone: string | null;

  @ApiProperty({
    example: 'test1@gmail.com',
    nullable: true,
    type: String,
  })
  email: string | null;

  @ApiProperty({
    example: true,
  })
  isConnected: boolean;

  @ApiProperty({
    example: new Date(),
  })
  lastConnection: Date;

  @ApiProperty({
    example: '61b7ac6b-2f07-42be-8416-443aafcebf23',
  })
  chatId: string;
}
