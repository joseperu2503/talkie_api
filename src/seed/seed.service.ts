import { Injectable } from '@nestjs/common';
import { initialData } from './data/seed-data';
import { AuthService } from 'src/auth/auth.service';
import { DataSource } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    private readonly authService: AuthService,
    private readonly dataSource: DataSource,
  ) {}

  async runSeed() {
    await this.dropAllTables();
    await this.userSeed();
  }

  private async userSeed() {
    const users = initialData.users;
    for (const user of users) {
      await this.authService.register(user);
    }
  }

  async dropAllTables(): Promise<void> {
    await this.dataSource.dropDatabase();
    await this.dataSource.synchronize();
  }
}
