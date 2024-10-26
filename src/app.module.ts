import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedModule } from './seed/seed.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { SeedCommand } from './seed/seed.command';
import { ChatModule } from './chat/chat.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ContactsModule } from './contacts/contacts.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      database: process.env.DB_NAME,
      username: process.env.DB_USERMAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    SeedModule,
    AuthModule,
    ChatModule,
    EventEmitterModule.forRoot(),
    ContactsModule,
    NotificationsModule,
  ],
  providers: [SeedCommand],
})
export class AppModule {}
