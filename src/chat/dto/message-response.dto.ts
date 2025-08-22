import { ApiProperty } from '@nestjs/swagger';

export class SenderResponseDto {
  @ApiProperty({
    example: 7,
  })
  id: number;

  @ApiProperty({
    example: 'James',
  })
  name: string;

  @ApiProperty({
    example: 'Anderson',
  })
  surname: string;

  @ApiProperty({
    example: 'test7@gmail.com',
    nullable: true,
    type: String,
  })
  email: string | null;

  @ApiProperty({
    example: 'https://randomuser.me/api/portraits/men/3.jpg',
    nullable: true,
    type: String,
  })
  photo: string | null;
}

export class ReceiverResponseDto {
  @ApiProperty({
    example: 7,
  })
  id: number;

  @ApiProperty({
    example: new Date(),
    nullable: true,
    type: Date,
  })
  deliveredAt: Date | null;

  @ApiProperty({
    example: new Date(),
    nullable: true,
    type: Date,
  })
  readAt: Date | null;
}

export class MessageResponseDto {
  @ApiProperty({
    example: '61b7ac6b-2f07-42be-8416-443aafcebf23',
  })
  id: string;

  @ApiProperty({
    example: 'Be there in 10 minutes!',
    nullable: true,
    type: String,
  })
  content: string | null;

  @ApiProperty({
    example: new Date(),
  })
  sentAt: Date;

  @ApiProperty({
    example: 'https://example.com/photo.jpg',
    nullable: true,
    type: String,
  })
  fileUrl: string | null;

  @ApiProperty({
    type: SenderResponseDto,
  })
  sender: SenderResponseDto;

  @ApiProperty({
    example: true,
  })
  isSender: boolean;

  @ApiProperty({
    example: '61b7ac6b-2f07-42be-8416-443aafcebf23',
  })
  chatId: string;

  @ApiProperty({
    example: '61b7ac6b-2f07-42be-8416-443aafcebf23',
    nullable: true,
  })
  temporalId?: string | null;

  @ApiProperty({
    type: ReceiverResponseDto,
    isArray: true,
  })
  receivers: ReceiverResponseDto[];
}
