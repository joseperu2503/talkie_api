import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import * as admin from 'firebase-admin';
import { extname } from 'path';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UploadFileResponseDto } from '../dto/upload-file-response.dto';
import { File } from '../entities/files.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  async uploadFile(file: Express.Multer.File): Promise<UploadFileResponseDto> {
    const bucket = admin.storage().bucket();
    const fileExtension = extname(file.originalname);
    const fileName = uuidv4() + fileExtension;

    const fileUpload = bucket.file(fileName);

    await fileUpload.save(file.buffer, {
      contentType: file.mimetype,
      metadata: {
        contentType: file.mimetype,
      },
    });

    await fileUpload.makePublic();

    const newFile = await this.fileRepository.save({
      name: fileName,
      mimetype: file.mimetype,
      url: fileUpload.publicUrl(),
      size: file.size,
    });

    return plainToInstance(UploadFileResponseDto, newFile, {
      excludeExtraneousValues: true,
    });
  }
}
