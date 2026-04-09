import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatalogModule } from './modules/catalog/catalog.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { StoresModule } from './modules/stores/store.module';
import { MenusModule } from './modules/menus/menus.module';
import { IdentityModule } from './modules/identity/identity.module';
import { OrdersModule } from './modules/orders/order.module';

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

        entities: [__dirname + '/modules/**/*.entity{.ts,.js}'],
        autoLoadEntities: false,
        synchronize: config.get('NODE_ENV') === 'development',

        ssl:
          config.get('NODE_ENV') === 'production'
            ? {
                rejectUnauthorized: false,
              }
            : false,
      }),
    }),
    CatalogModule,
    IdentityModule,
    InventoryModule,
    MenusModule,
    NotificationModule,
    OrdersModule,
    StoresModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
