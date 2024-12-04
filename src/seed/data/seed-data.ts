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
      phone: '993689111',
      username: 'john_smith01',
      photo: 'https://randomuser.me/api/portraits/men/1.jpg',
      phoneCountryId: 168,
    },
    {
      email: 'test2@gmail.com',
      name: 'Emily',
      surname: 'Johnson',
      password: 'Abc123',
      phone: '993689112',
      username: 'emily_johnson02',
      photo: 'https://randomuser.me/api/portraits/women/1.jpg',
      phoneCountryId: 168,
    },
    {
      email: 'test3@gmail.com',
      name: 'Michael',
      surname: 'Brown',
      password: 'Abc123',
      phone: '993689113',
      username: 'michael_brown03',
      phoneCountryId: 168,
    },
    {
      email: 'test4@gmail.com',
      name: 'Sarah',
      surname: 'Davis',
      password: 'Abc123',
      phone: '993689114',
      username: 'sarah_davis04',
      photo: 'https://randomuser.me/api/portraits/women/2.jpg',
      phoneCountryId: 168,
    },
    {
      email: 'test5@gmail.com',
      name: 'David',
      surname: 'Wilson',
      password: 'Abc123',
      phone: '993689115',
      username: 'david_wilson05',
      photo: 'https://randomuser.me/api/portraits/men/2.jpg',
      phoneCountryId: 168,
    },
    {
      email: 'test6@gmail.com',
      name: 'Olivia',
      surname: 'Taylor',
      password: 'Abc123',
      phone: '993689116',
      username: 'olivia_taylor06',
      photo: 'https://randomuser.me/api/portraits/women/3.jpg',
      phoneCountryId: 168,
    },
    {
      email: 'test7@gmail.com',
      name: 'James',
      surname: 'Anderson',
      password: 'Abc123',
      phone: '993689117',
      username: 'james_anderson07',
      photo: 'https://randomuser.me/api/portraits/men/3.jpg',
      phoneCountryId: 168,
    },
    {
      email: 'test8@gmail.com',
      name: 'Sophia',
      surname: 'Thomas',
      password: 'Abc123',
      phone: '993689118',
      username: 'sophia_thomas08',
      phoneCountryId: 168,
    },
    {
      email: 'test9@gmail.com',
      name: 'William',
      surname: 'Martinez',
      password: 'Abc123',
      phone: '993689119',
      username: 'william_martinez09',
      photo: 'https://randomuser.me/api/portraits/men/4.jpg',
      phoneCountryId: 168,
    },
    {
      email: 'test10@gmail.com',
      name: 'Mia',
      surname: 'Harris',
      password: 'Abc123',
      phone: '993689120',
      username: 'mia_harris10',
      phoneCountryId: 168,
    },
    {
      email: 'test11@gmail.com',
      name: 'Robert',
      surname: 'Clark',
      password: 'Abc123',
      phone: '993689121',
      username: 'robert_clark11',
      photo: 'https://randomuser.me/api/portraits/men/5.jpg',
      phoneCountryId: 168,
    },
    {
      email: 'test12@gmail.com',
      name: 'Ava',
      surname: 'Lewis',
      password: 'Abc123',
      phone: '993689122',
      username: 'ava_lewis12',
      phoneCountryId: 168,
    },
    {
      email: 'test13@gmail.com',
      name: 'Benjamin',
      surname: 'Hall',
      password: 'Abc123',
      phone: '983689123',
      username: 'benjamin_hall13',
      photo: 'https://randomuser.me/api/portraits/men/6.jpg',
      phoneCountryId: 168,
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
