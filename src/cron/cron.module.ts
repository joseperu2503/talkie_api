import { Module } from '@nestjs/common';
import { SeedModule } from 'src/seed/seed.module';
import { CronService } from './cron.service';

@Module({
  providers: [CronService],
  imports: [SeedModule],
})
export class CronModule {}
