import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/auth/entities/user.entity';
import { AuthMethod } from 'src/core/models/auth-method';
import { Repository } from 'typeorm';

@Injectable()
export class UserSeed {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  users: UserSeedData[] = [
    {
      id: '578414e1-f1cd-490b-a92b-767899a0d780',
      email: 'test1@gmail.com',
      name: 'John',
      surname: 'Smith',
      password: 'Abc123',
      phone: {
        number: '993689111',
        countryId: 168,
      },
      photo: 'https://randomuser.me/api/portraits/men/1.jpg',
      type: AuthMethod.EMAIL,
    },
    {
      id: 'bcd67ec8-4070-472a-bd1f-a46f3674acc1',
      email: 'test2@gmail.com',
      name: 'Emily',
      surname: 'Johnson',
      password: 'Abc123',
      phone: {
        number: '993689112',
        countryId: 168,
      },
      photo: 'https://randomuser.me/api/portraits/women/1.jpg',
      type: AuthMethod.EMAIL,
    },
    {
      id: '9e234ee4-de1e-4061-8794-6e20b46479da',
      email: 'test3@gmail.com',
      name: 'Michael',
      surname: 'Brown',
      password: 'Abc123',
      phone: {
        number: '993689113',
        countryId: 168,
      },
      type: AuthMethod.EMAIL,
    },
    {
      id: 'cde012ec-45ac-484c-bd28-08614f0336db',
      email: 'test4@gmail.com',
      name: 'Sarah',
      surname: 'Davis',
      password: 'Abc123',
      phone: {
        number: '993689114',
        countryId: 168,
      },
      photo: 'https://randomuser.me/api/portraits/women/2.jpg',
      type: AuthMethod.EMAIL,
    },
    {
      id: '75f3a6e3-eea4-48ba-bfa1-9447c7faa7ba',
      email: 'test5@gmail.com',
      name: 'David',
      surname: 'Wilson',
      password: 'Abc123',
      phone: {
        number: '993689115',
        countryId: 168,
      },
      photo: 'https://randomuser.me/api/portraits/men/2.jpg',
      type: AuthMethod.EMAIL,
    },
    {
      id: 'd32f1f4d-79a9-4e37-8fb7-425e9ef75b40',
      email: 'test6@gmail.com',
      name: 'Olivia',
      surname: 'Taylor',
      password: 'Abc123',
      phone: {
        number: '993689116',
        countryId: 168,
      },
      photo: 'https://randomuser.me/api/portraits/women/3.jpg',
      type: AuthMethod.EMAIL,
    },
    {
      id: 'e79e7b6c-48c2-40cb-8a57-7dcf7cfe6d94',
      email: 'test7@gmail.com',
      name: 'James',
      surname: 'Anderson',
      password: 'Abc123',
      phone: {
        number: '993689117',
        countryId: 168,
      },
      photo: 'https://randomuser.me/api/portraits/men/3.jpg',
      type: AuthMethod.EMAIL,
    },
    {
      id: '2774b4e5-e4cf-4ab2-99fe-f80ecb91ff6d',
      email: 'test8@gmail.com',
      name: 'Sophia',
      surname: 'Thomas',
      password: 'Abc123',
      phone: {
        number: '993689118',
        countryId: 168,
      },
      type: AuthMethod.EMAIL,
    },
    {
      id: '172a390c-8a99-4102-accd-75da4c00551c',
      email: 'test9@gmail.com',
      name: 'William',
      surname: 'Martinez',
      password: 'Abc123',
      phone: {
        number: '993689119',
        countryId: 168,
      },
      photo: 'https://randomuser.me/api/portraits/men/4.jpg',
      type: AuthMethod.EMAIL,
    },
    {
      id: 'b27e1454-3ea9-4d28-9fae-90c2de2394f4',
      email: 'test10@gmail.com',
      name: 'Mia',
      surname: 'Harris',
      password: 'Abc123',
      phone: {
        number: '993689120',
        countryId: 168,
      },
      type: AuthMethod.EMAIL,
    },
    {
      id: 'a1c689e8-9db0-4977-a0b7-ca5f6a604fdd',
      email: 'test11@gmail.com',
      name: 'Robert',
      surname: 'Clark',
      password: 'Abc123',
      phone: {
        number: '993689121',
        countryId: 168,
      },
      photo: 'https://randomuser.me/api/portraits/men/5.jpg',
      type: AuthMethod.EMAIL,
    },
    {
      id: 'ad219bd0-8d41-429c-ba7f-c5e0b44f0e31',
      email: 'test12@gmail.com',
      name: 'Ava',
      surname: 'Lewis',
      password: 'Abc123',
      phone: {
        number: '993689122',
        countryId: 168,
      },
      type: AuthMethod.EMAIL,
    },
    {
      id: 'cb1779aa-26b8-4581-a734-075cbe605714',
      email: 'test13@gmail.com',
      name: 'Benjamin',
      surname: 'Hall',
      password: 'Abc123',
      phone: {
        number: '983689123',
        countryId: 168,
      },
      photo: 'https://randomuser.me/api/portraits/men/6.jpg',
      type: AuthMethod.EMAIL,
    },
  ];

  async run() {
    for (const user of this.users) {
      await this.create(user);
    }
  }

  async create(params: UserSeedData) {
    const { password, email, phone, type, ...userData } = params;

    //** Crear el usuario */
    const user = this.userRepository.create({
      ...userData,
      password: bcrypt.hashSync(password, 10),
    });

    //** Aignar email o telefono */
    if (type == AuthMethod.EMAIL && email) {
      user.email = email;
    }

    if (type == AuthMethod.PHONE && phone) {
      user.phone = phone.number;
      user.phoneCountryId = phone.countryId;
    }

    //** Guardar el usuario */
    await this.userRepository.save(user);
  }
}

interface UserSeedData {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: {
    number: string;
    countryId: number;
  };
  password: string;
  photo?: string;
  type: AuthMethod;
}
