import { Injectable } from '@nestjs/common';
import { initialData } from './data/seed-data';
import { AuthService } from 'src/auth/auth.service';
import { DataSource } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { ContactService } from 'src/contacts/services/contact.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly authService: AuthService,
    private readonly dataSource: DataSource,
    private readonly contactService: ContactService,
  ) {}

  async runSeed() {
    await this.dropAllTables();
    await this.userSeed();
    await this.contactSeed();
  }

  private async userSeed() {
    const users = initialData.users;
    for (const user of users) {
      await this.authService.register(user);
    }
  }

  private async contactSeed() {
    const contacts = initialData.contacts;
    const user: User | null = await this.authService.findOne(1);
    if (!user) return;
    for (const contact of contacts) {
      await this.contactService.addContact(contact, user);
    }
  }

  async dropAllTables(): Promise<void> {
    await this.dataSource.dropDatabase();
    await this.dataSource.synchronize();
  }
}
