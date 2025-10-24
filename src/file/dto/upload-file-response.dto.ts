import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UploadFileResponseDto {
  @ApiProperty({
    example: '0b724adb-5e9e-4de4-920a-b911fe2dc4b9',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: '0b724adb-5e9e-4de4-920a-b911fe2dc4b9.jpg',
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: 'image/jpeg',
  })
  @Expose()
  mimetype: string;

  @ApiProperty({
    example: 1024,
  })
  @Expose()
  size: number;

  @ApiProperty({
    example: 'https://example.com/photo.jpg',
  })
  @Expose()
  url: string;
}
