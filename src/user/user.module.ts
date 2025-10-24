import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserService } from './services/user.service';

@Module({
  providers: [UserService],
  controllers: [],
  imports: [AuthModule],
  exports: [UserService],
})
export class UserModule {}
