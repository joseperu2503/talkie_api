import { Module } from '@nestjs/common';
import { VerificationCodesService } from './services/verification-codes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationCode } from './entities/verification-code.entity';

@Module({
  providers: [VerificationCodesService],
  imports: [TypeOrmModule.forFeature([VerificationCode])],
  exports: [VerificationCodesService],
})
export class VerificationCodesModule {}
