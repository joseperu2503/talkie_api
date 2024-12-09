import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersService } from 'src/users/services/users.service';
import { TwilioService } from 'src/twilio/services/twilio.service';
import { CountriesModule } from 'src/countries/countries.module';
import { VerificationCodesService } from 'src/verification-codes/services/verification-codes.service';
import { VerificationCode } from 'src/verification-codes/entities/verification-code.entity';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UsersService,
    TwilioService,
    VerificationCodesService,
  ],
  imports: [
    TypeOrmModule.forFeature([User, VerificationCode]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: '78h',
          },
        };
      },
    }),
    CountriesModule,
  ],
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule, AuthService],
})
export class AuthModule {}
