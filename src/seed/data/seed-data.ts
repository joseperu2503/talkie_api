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
  ],
};
