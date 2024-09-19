import { RegisterUserDto } from 'src/auth/dto/register-user.dto';

interface SeedData {
  users: RegisterUserDto[];
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
    },
    {
      email: 'test2@gmail.com',
      name: 'Patricia',
      surname: 'Campos',
      password: 'Abc123',
      phone: '993689144',
      username: 'patricia05',
    },
  ],
};
