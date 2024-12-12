import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedModule } from './seed/seed.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { SeedCommand } from './seed/commands/seed.command';
import { ChatModule } from './chat/chat.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ContactsModule } from './contacts/contacts.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CountriesModule } from './countries/countries.module';
import { UsersModule } from './users/users.module';
import { VerificationCodesModule } from './verification-codes/verification-codes.module';
import { MailModule } from './mail/mail.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: false,
    }),
    SeedModule,
    AuthModule,
    ChatModule,
    EventEmitterModule.forRoot(),
    ContactsModule,
    NotificationsModule,
    CountriesModule,
    UsersModule,
    VerificationCodesModule,
    MailModule,
  ],
  providers: [SeedCommand],
})
export class AppModule {}
