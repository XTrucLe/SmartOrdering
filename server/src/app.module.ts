import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './modules/accounts/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { ProfileModule } from './modules/profiles/profile.module';
import { StoresModule } from './modules/stores/store.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),

        namingStrategy: new SnakeNamingStrategy(),

        entities: [
          // __dirname + '/**/*.entity{.ts,.js}'
          __dirname + '/modules/auth/**/*.entity{.ts,.js}',
          __dirname + '/modules/users/**/*.entity{.ts,.js}',
          __dirname + '/modules/accounts/**/*.entity{.ts,.js}',
          __dirname + '/modules/profiles/**/*.entity{.ts,.js}',
          __dirname + '/modules/notifications/**/*.entity{.ts,.js}',
          __dirname + '/modules/stores/**/*.entity{.ts,.js}',
          __dirname + '/modules/catalog/**/*.entity{.ts,.js}',
          __dirname + '/modules/inventory/**/*.entity{.ts,.js}',
        ],
        autoLoadEntities: false,
        synchronize: true,
      }),
    }),
    AccountModule,
    AuthModule,
    CatalogModule,
    InventoryModule,
    NotificationModule,
    ProfileModule,
    StoresModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
