import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [SeedService],
  imports: [AuthModule],
  exports: [SeedService],
})
export class SeedModule {}
