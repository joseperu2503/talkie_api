import { ApiProperty } from '@nestjs/swagger';

export class ContactResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier of the contact',
  })
  id: number;

  @ApiProperty({
    example: 'John',
    description: 'Contact name',
  })
  name: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Contact surname',
  })
  surname: string;

  @ApiProperty({
    example: 'https://example.com/photo.jpg',
    description: 'Contact photo',
    nullable: true,
  })
  photo: string | null;

  @ApiProperty({
    example: '+1234567890',
    description: 'Contact phone number',
    nullable: true,
  })
  phone: string | null;

  @ApiProperty({
    example: 'test1@gmail.com',
    description: 'Contact email',
    nullable: true,
  })
  email: string | null;

  @ApiProperty({
    example: true,
    description: 'Whether the contact is connected',
  })
  isConnected: boolean;

  @ApiProperty({
    example: new Date(),
    description: 'Last connection date',
  })
  lastConnection: Date;

  @ApiProperty({
    example: '61b7ac6b-2f07-42be-8416-443aafcebf23',
    description: 'Unique identifier of the chat',
  })
  chatId: string;
}
