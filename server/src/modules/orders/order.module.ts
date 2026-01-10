import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemsController } from './controllers/order-items.controller';
import { OrdersController } from './controllers/orders.controller';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { OrderItemsService } from './services/order-items.service';
import { OrdersService } from './services/orders.service';
import { StoresModule } from '../stores/store.module';
import { ItemsModule } from '../items/items.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    StoresModule,
    ItemsModule,
  ],
  controllers: [OrdersController, OrderItemsController],
  providers: [OrdersService, OrderItemsService],
})
export class OrdersModule {}
