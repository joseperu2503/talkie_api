import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { ContactsModule } from './contacts/contacts.module';
import { CountriesModule } from './countries/countries.module';
import { MailModule } from './mail/mail.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SeedCommand } from './seed/commands/seed.command';
import { SeedModule } from './seed/seed.module';
import { UsersModule } from './users/users.module';
import { VerificationCodesModule } from './verification-codes/verification-codes.module';
import { CronModule } from './cron/cron.module';

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
    ScheduleModule.forRoot(),
    ContactsModule,
    NotificationsModule,
    CountriesModule,
    UsersModule,
    VerificationCodesModule,
    MailModule,
    CronModule,
  ],
  providers: [SeedCommand],
})
export class AppModule {}
