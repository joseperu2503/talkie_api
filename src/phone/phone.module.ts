import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Phone } from './entities/phone.entity';
import { PhoneService } from './services/phone.service';

@Module({
  imports: [TypeOrmModule.forFeature([Phone])],
  exports: [TypeOrmModule, PhoneService],
  providers: [PhoneService],
})
export class PhoneModule {}
