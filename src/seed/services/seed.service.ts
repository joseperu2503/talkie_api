import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ContactSeed } from './contact.seed';
import { CountrySeed } from './country.seed';
import { UserSeed } from './user.seed';

@Injectable()
export class SeedService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userSeed: UserSeed,
    private readonly contactSeed: ContactSeed,
    private readonly countrySeed: CountrySeed,
  ) {}

  async runSeed() {
    await this.dropAllTables();
    await this.userSeed.run();
    await this.contactSeed.run();
    await this.countrySeed.run();
  }

  async dropAllTables(): Promise<void> {
    await this.dataSource.dropDatabase();
    await this.dataSource.synchronize();
  }
}
