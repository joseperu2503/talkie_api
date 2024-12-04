import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { AddContactDto } from 'src/contacts/dto/add-contact.dto';

interface SeedData {
  users: RegisterUserDto[];
  contacts: AddContactDto[];
}

export const initialData: SeedData = {
  users: [
    {
      email: 'test1@gmail.com',
      name: 'John',
      surname: 'Smith',
      password: 'Abc123',
      phone: {
        number: '993689111',
        countryId: 168,
      },
      username: 'john_smith01',
      photo: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      email: 'test2@gmail.com',
      name: 'Emily',
      surname: 'Johnson',
      password: 'Abc123',
      phone: {
        number: '993689112',
        countryId: 168,
      },
      username: 'emily_johnson02',
      photo: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    {
      email: 'test3@gmail.com',
      name: 'Michael',
      surname: 'Brown',
      password: 'Abc123',
      phone: {
        number: '993689113',
        countryId: 168,
      },
      username: 'michael_brown03',
    },
    {
      email: 'test4@gmail.com',
      name: 'Sarah',
      surname: 'Davis',
      password: 'Abc123',
      phone: {
        number: '993689114',
        countryId: 168,
      },
      username: 'sarah_davis04',
      photo: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    {
      email: 'test5@gmail.com',
      name: 'David',
      surname: 'Wilson',
      password: 'Abc123',
      phone: {
        number: '993689115',
        countryId: 168,
      },
      username: 'david_wilson05',
      photo: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    {
      email: 'test6@gmail.com',
      name: 'Olivia',
      surname: 'Taylor',
      password: 'Abc123',
      phone: {
        number: '993689116',
        countryId: 168,
      },
      username: 'olivia_taylor06',
      photo: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
    {
      email: 'test7@gmail.com',
      name: 'James',
      surname: 'Anderson',
      password: 'Abc123',
      phone: {
        number: '993689117',
        countryId: 168,
      },
      username: 'james_anderson07',
      photo: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    {
      email: 'test8@gmail.com',
      name: 'Sophia',
      surname: 'Thomas',
      password: 'Abc123',
      phone: {
        number: '993689118',
        countryId: 168,
      },
      username: 'sophia_thomas08',
    },
    {
      email: 'test9@gmail.com',
      name: 'William',
      surname: 'Martinez',
      password: 'Abc123',
      phone: {
        number: '993689119',
        countryId: 168,
      },
      username: 'william_martinez09',
      photo: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
    {
      email: 'test10@gmail.com',
      name: 'Mia',
      surname: 'Harris',
      password: 'Abc123',
      phone: {
        number: '993689120',
        countryId: 168,
      },
      username: 'mia_harris10',
    },
    {
      email: 'test11@gmail.com',
      name: 'Robert',
      surname: 'Clark',
      password: 'Abc123',
      phone: {
        number: '993689121',
        countryId: 168,
      },
      username: 'robert_clark11',
      photo: 'https://randomuser.me/api/portraits/men/5.jpg',
    },
    {
      email: 'test12@gmail.com',
      name: 'Ava',
      surname: 'Lewis',
      password: 'Abc123',
      phone: {
        number: '993689122',
        countryId: 168,
      },
      username: 'ava_lewis12',
    },
    {
      email: 'test13@gmail.com',
      name: 'Benjamin',
      surname: 'Hall',
      password: 'Abc123',
      phone: {
        number: '983689123',
        countryId: 168,
      },
      username: 'benjamin_hall13',
      photo: 'https://randomuser.me/api/portraits/men/6.jpg',
    },
  ],
  contacts: [
    {
      username: 'emily_johnson02',
    },
    {
      username: 'michael_brown03',
    },
    {
      username: 'sarah_davis04',
    },
    {
      username: 'david_wilson05',
    },
    {
      username: 'olivia_taylor06',
    },
    {
      username: 'james_anderson07',
    },
    {
      username: 'sophia_thomas08',
    },
  ],
};
