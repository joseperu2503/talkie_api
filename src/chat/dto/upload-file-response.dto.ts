import { ApiProperty } from '@nestjs/swagger';

export class UploadFileResponseDto {
  @ApiProperty({
    example: 'https://example.com/photo.jpg',
  })
  fileUrl: string;
}
