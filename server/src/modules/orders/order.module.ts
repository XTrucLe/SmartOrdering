import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './controllers/orders.controller';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { OrderService } from './services/order.service';
import { StoresModule } from '../stores/store.module';
import { MenusModule } from '../menus/menus.module';
import { IdentityModule } from '../identity/identity.module';
import { OrderValidateService } from './services/order-validate.service';
import { OrderPricingService } from './services/order-pricing.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    StoresModule,
    MenusModule,
    IdentityModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderValidateService, OrderPricingService],
  exports: [OrderService],
})
export class OrdersModule {}
