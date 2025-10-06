import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SeedService } from 'src/seed/services/seed.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private readonly seedService: SeedService) {}

  // Cronjob que se ejecuta todos los días a medianoche
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleDailyTask() {
    this.seedService.runSeed();
  }
}
