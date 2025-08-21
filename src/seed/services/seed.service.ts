import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/services/auth.service';
import { ContactService } from 'src/contacts/services/contact.service';
import { CountriesService } from 'src/countries/services/countries.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users.service';
import { DataSource } from 'typeorm';
import { countries } from '../data/countries';
import { initialData } from '../data/seed-data';

@Injectable()
export class SeedService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly dataSource: DataSource,
    private readonly contactService: ContactService,
    private readonly countriesService: CountriesService,
  ) {}

  async runSeed() {
    await this.dropAllTables();
    await this.countrySeed();
    await this.testUserSeed();
    await this.testContactSeed();
  }

  private async testUserSeed() {
    // if (process.env.NODE_ENV !== 'development') return;

    const users = initialData.users;
    for (const user of users) {
      await this.authService.register(user);
    }
  }

  private async testContactSeed() {
    // if (process.env.NODE_ENV !== 'development') return;

    const contacts = initialData.contacts;
    const user: UserEntity | null = await this.usersService.findOne(1);
    if (!user) return;
    for (const contact of contacts) {
      await this.contactService.addContact(contact, user, false);
    }
  }

  private async countrySeed() {
    for (const country of countries) {
      await this.countriesService.create(country);
    }
  }

  async dropAllTables(): Promise<void> {
    await this.dataSource.dropDatabase();
    await this.dataSource.synchronize();
  }
}
