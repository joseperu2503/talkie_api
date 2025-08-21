import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesModule } from 'src/countries/countries.module';
import { MailModule } from 'src/mail/mail.module';
import { TwilioService } from 'src/twilio/services/twilio.service';
import { VerificationCode } from 'src/verification-codes/entities/verification-code.entity';
import { VerificationCodesService } from 'src/verification-codes/services/verification-codes.service';
import { AuthController } from './controllers/auth.controller';
import { UserEntity } from './entities/user.entity';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    TwilioService,
    VerificationCodesService,
  ],
  imports: [
    TypeOrmModule.forFeature([UserEntity, VerificationCode]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: '720h',
          },
        };
      },
    }),
    CountriesModule,
    MailModule,
  ],
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule, AuthService],
})
export class AuthModule {}
