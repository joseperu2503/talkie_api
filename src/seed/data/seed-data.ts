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
      name: 'Junior',
      surname: 'Perez',
      password: 'Abc123',
      phone: '993689145',
      username: 'joseperu2503',
      photo: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      email: 'test2@gmail.com',
      name: 'Patricia',
      surname: 'Campos',
      password: 'Abc123',
      phone: '993689144',
      username: 'patricia05',
      photo: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    {
      email: 'test3@gmail.com',
      name: 'Carlos',
      surname: 'Ramirez',
      password: 'Abc123',
      phone: '993689143',
      username: 'carlosramirez10',
    },
    {
      email: 'test4@gmail.com',
      name: 'Andrea',
      surname: 'Lopez',
      password: 'Abc123',
      phone: '993689142',
      username: 'andrea_lopez',
      photo: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    {
      email: 'test5@gmail.com',
      name: 'Luis',
      surname: 'Gomez',
      password: 'Abc123',
      phone: '993689141',
      username: 'lgomez12',
      photo: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    {
      email: 'test6@gmail.com',
      name: 'Sofia',
      surname: 'Torres',
      password: 'Abc123',
      phone: '993689140',
      username: 'sofia_torres',
      photo: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
    {
      email: 'test7@gmail.com',
      name: 'Mario',
      surname: 'Vargas',
      password: 'Abc123',
      phone: '993689139',
      username: 'mario_vargas13',
      photo: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    {
      email: 'test8@gmail.com',
      name: 'Fernanda',
      surname: 'Silva',
      password: 'Abc123',
      phone: '993689138',
      username: 'fernanda_silva14',
    },
    {
      email: 'test9@gmail.com',
      name: 'Diego',
      surname: 'Cruz',
      password: 'Abc123',
      phone: '993689137',
      username: 'diego_cruz15',
      photo: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
    {
      email: 'test10@gmail.com',
      name: 'Valeria',
      surname: 'Morales',
      password: 'Abc123',
      phone: '993689136',
      username: 'valeria_morales',
    },
    {
      email: 'test11@gmail.com',
      name: 'Jorge',
      surname: 'Pineda',
      password: 'Abc123',
      phone: '993689135',
      username: 'jorgepineda16',
      photo: 'https://randomuser.me/api/portraits/men/5.jpg',
    },
    {
      email: 'test12@gmail.com',
      name: 'Daniela',
      surname: 'Reyes',
      password: 'Abc123',
      phone: '993689134',
      username: 'daniela_reyes17',
    },
    {
      email: 'joseperu2503@gmail.com',
      name: 'Junior',
      surname: 'Perez',
      password: 'Abc123',
      phone: '983689145',
      username: 'junior25023',
      photo: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
  ],
  contacts: [
    {
      username: 'patricia05',
    },
    {
      username: 'andrea_lopez',
    },
    {
      username: 'carlosramirez10',
    },
    {
      username: 'lgomez12',
    },
    {
      username: 'sofia_torres',
    },
    {
      username: 'mario_vargas13',
    },
    {
      username: 'fernanda_silva14',
    },
  ],
};
