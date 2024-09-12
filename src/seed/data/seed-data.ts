import { RegisterUserDto } from 'src/auth/dto/register-user.dto';

interface SeedData {
  users: RegisterUserDto[];
}

export const initialData: SeedData = {
  users: [
    {
      email: 'test1@gmail.com',
      name: 'Test',
      surname: 'User',
      password: 'Abc123',
      phone: '993689145',
    },
    {
      email: 'test2@gmail.com',
      name: 'Test2',
      surname: 'User2',
      password: 'Abc123',
      phone: '993689145',
    },
  ],
};
