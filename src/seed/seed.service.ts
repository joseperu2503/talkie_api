import { Injectable } from '@nestjs/common';
import { initialData } from './data/seed-data';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class SeedService {
  constructor(private readonly authService: AuthService) {}

  async runSeed() {
    await this.userSeed();
  }

  private async userSeed() {
    const users = initialData.users;
    for (const user of users) {
      await this.authService.register(user);
    }
  }
}
