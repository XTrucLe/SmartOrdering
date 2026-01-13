import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';
import { resetDatabase } from '../helpers/reset_db.helper';
import { CreateStoreDto } from '../../src/modules/stores/dtos/create-store.dto';
import { CreateCategoryDto } from '../../src/modules/categories/dtos/create-category.dto';
import { CreateItemDto } from '../../src/modules/items/dtos/create-item.dto';
import { ItemType } from '../../src/modules/items/constants/item.constant';
import { CreateOrderDto } from '../../src/modules/orders/dtos/orders/create-order.dto';
import {
  CancelReason,
  DeliveryMethod,
  OrderStatus,
} from '../../src/modules/orders/constants/order.constant';
import { App } from 'supertest/types';
import { OrderResponseDto } from 'src/modules/orders/dtos/orders/order.response.dto';
import { ItemResponseDto } from 'src/modules/items/dtos/item.response.dto';
import { StoreResponseDto } from 'src/modules/stores/dtos/store.response.dto';
import { CategoryResponseDto } from 'src/modules/categories/dtos/category.response.dto';

describe('OrdersController (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;

  let store: StoreResponseDto;
  let category: CategoryResponseDto;
  let item: ItemResponseDto;

  const createStoreDto: CreateStoreDto = {
    name: 'Test Store for Orders',
    address: '456 Order Ave',
  };

  const createCategoryDto: CreateCategoryDto = {
    name: 'Order Category',
  };

  const createItemDto: CreateItemDto = {
    name: 'Order Item',
    price: 12.5,
    type: ItemType.FOOD,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
    await resetDatabase(dataSource);
  });

  beforeEach(async () => {
    // Create a store, category, and item for testing orders
    const storeResponse = await request(app.getHttpServer())
      .post('/stores')
      .send(createStoreDto);
    store = storeResponse.body as StoreResponseDto;

    const categoryResponse = await request(app.getHttpServer())
      .post(`/stores/${store.id}/categorys`)
      .send(createCategoryDto);
    category = categoryResponse.body as CategoryResponseDto;

    const itemResponse = await request(app.getHttpServer())
      .post(`/stores/${store.id}/items`)
      .send({ ...createItemDto, categoryId: category.id });
    item = itemResponse.body as ItemResponseDto;
  });

  afterAll(async () => {
    await app.close();
  });

  // Test suite for creating an order
  describe('POST /stores/:storeId/orders', () => {
    it('should create a new order successfully', async () => {
      const createOrderDto: CreateOrderDto = {
        items: [{ itemId: item.id, quantity: 2 }],
        deliveryMethod: DeliveryMethod.DINE_IN,
        table: 'T1',
      };

      const response = await request(app.getHttpServer())
        .post(`/stores/${store.id}/orders`)
        .send(createOrderDto)
        .expect(201);

      const body = response.body as OrderResponseDto;

      expect(body).toBeDefined();
      expect(body.status).toEqual(OrderStatus.PENDING);
      expect(body.orderItems).toHaveLength(1);
      expect(body.orderItems[0].itemName).toEqual(item.name);
      expect(Number(body.totalPrice)).toEqual(item.price * 2);
    });

    it('should fail if items array is empty', async () => {
      const createOrderDto: CreateOrderDto = { items: [] };
      await request(app.getHttpServer())
        .post(`/stores/${store.id}/orders`)
        .send(createOrderDto)
        .expect(400);
    });

    it('should fail if itemId is invalid', async () => {
      const invalidUUID = 'b2d8f9e0-8b5c-4e7a-9a0e-4d5f6a7b8c9d';
      const createOrderDto: CreateOrderDto = {
        items: [{ itemId: invalidUUID, quantity: 1 }],
      };

      await request(app.getHttpServer())
        .post(`/stores/${store.id}/orders`)
        .send(createOrderDto)
        .expect(404); // Not found for the item
    });
  });

  // Test suite for getting orders
  describe('GET /stores/:storeId/orders', () => {
    beforeEach(async () => {
      // Create an order to be found
      const createOrderDto: CreateOrderDto = {
        items: [{ itemId: item.id, quantity: 1 }],
      };
      await request(app.getHttpServer())
        .post(`/stores/${store.id}/orders`)
        .send(createOrderDto);
    });

    it('should get all orders for a store', async () => {
      const response = await request(app.getHttpServer())
        .get(`/stores/${store.id}/orders`)
        .expect(200);

      const body = response.body as OrderResponseDto[];

      expect(body).toHaveLength(1);
      expect(body[0].orderItems[0].itemName).toEqual(item.name);
      expect(Number(body[0].totalPrice)).toEqual(item.price);
    });
  });

  // Test suite for getting a single order
  describe('GET /stores/:storeId/orders/:orderId', () => {
    let order: OrderResponseDto;

    beforeEach(async () => {
      const createOrderDto: CreateOrderDto = {
        items: [{ itemId: item.id, quantity: 1 }],
      };
      const response = await request(app.getHttpServer())
        .post(`/stores/${store.id}/orders`)
        .send(createOrderDto);
      order = response.body as OrderResponseDto;
    });

    it('should get an order by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/stores/${store.id}/orders/${order.id}`)
        .expect(200);

      const body = res.body as OrderResponseDto;
      expect(body.id).toEqual(order.id);
    });

    it('should return 404 for a non-existent order', async () => {
      const invalidUUID = 'b2d8f9e0-8b5c-4e7a-9a0e-4d5f6a7b8c9d';
      await request(app.getHttpServer())
        .get(`/stores/${store.id}/orders/${invalidUUID}`)
        .expect(404);
    });
  });

  // Test suite for order status transitions
  describe('Order Status Transitions', () => {
    let order: OrderResponseDto;

    beforeEach(async () => {
      const createOrderDto: CreateOrderDto = {
        items: [{ itemId: item.id, quantity: 1 }],
      };
      const response = await request(app.getHttpServer())
        .post(`/stores/${store.id}/orders`)
        .send(createOrderDto);
      order = response.body as OrderResponseDto;
    });

    it('should confirm a pending order', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/stores/${store.id}/orders/${order.id}/confirm`)
        .expect(200);
      const body = response.body as OrderResponseDto;
      expect(body.status).toEqual(OrderStatus.CONFIRM);
    });

    it('should prepare a confirmed order', async () => {
      // First confirm
      await request(app.getHttpServer()).patch(
        `/stores/${store.id}/orders/${order.id}/confirm`,
      );
      // Then prepare
      const response = await request(app.getHttpServer())
        .patch(`/stores/${store.id}/orders/${order.id}/prepare`)
        .expect(200);
      const body = response.body as OrderResponseDto;
      expect(body.status).toEqual(OrderStatus.PREPARING);
    });

    it('should set a prepared order to ready', async () => {
      await request(app.getHttpServer()).patch(
        `/stores/${store.id}/orders/${order.id}/confirm`,
      );
      await request(app.getHttpServer()).patch(
        `/stores/${store.id}/orders/${order.id}/prepare`,
      );
      const response = await request(app.getHttpServer())
        .patch(`/stores/${store.id}/orders/${order.id}/ready`)
        .expect(200);
      const body = response.body as OrderResponseDto;
      expect(body.status).toEqual(OrderStatus.READY);
    });

    it('should complete a ready order', async () => {
      await request(app.getHttpServer()).patch(
        `/stores/${store.id}/orders/${order.id}/confirm`,
      );
      await request(app.getHttpServer()).patch(
        `/stores/${store.id}/orders/${order.id}/prepare`,
      );
      await request(app.getHttpServer()).patch(
        `/stores/${store.id}/orders/${order.id}/ready`,
      );
      const response = await request(app.getHttpServer())
        .patch(`/stores/${store.id}/orders/${order.id}/complete`)
        .expect(200);

      const body = response.body as OrderResponseDto;
      expect(body.status).toEqual(OrderStatus.COMPLETED);
    });

    it('should cancel an order', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/stores/${store.id}/orders/${order.id}/cancel`)
        .send({ reason: CancelReason.CUSTOMER_REQUEST })
        .expect(200);

      const body = response.body as OrderResponseDto;
      expect(body.status).toEqual(OrderStatus.CANCELLED);
    });

    it('should fail to transition to an invalid state', async () => {
      // Try to prepare a pending order (should fail)
      await request(app.getHttpServer())
        .patch(`/stores/${store.id}/orders/${order.id}/prepare`)
        .expect(400);
    });
  });
});
