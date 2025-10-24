import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { FileController } from './controller/file.controller';
import { File } from './entities/files.entity';
import { FileService } from './services/file.service';

@Module({
  providers: [FileService],
  exports: [FileService, TypeOrmModule],
  imports: [TypeOrmModule.forFeature([File]), AuthModule],
  controllers: [FileController],
})
export class FileModule {}
