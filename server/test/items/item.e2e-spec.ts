import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';
import { resetDatabase } from '../helpers/reset_db.helper';
import { CreateStoreDto } from '../../src/modules/stores/dtos/create-store.dto';
import { CreateMenuDto } from '../../src/modules/menus/dtos/create-menu.dto';
import { CreateItemDto } from '../../src/modules/items/dtos/create-item.dto';
import { ItemType } from '../../src/modules/items/constants/item.constant';
import { UpdateItemDto } from 'src/modules/items/dtos/update-item.dto';
import { App } from 'supertest/types';
import { MenuResponseDto } from 'src/modules/menus/dtos/menu.response.dto';
import { StoreResponseDto } from 'src/modules/stores/dtos/store.response.dto';
import { ItemResponseDto } from 'src/modules/items/dtos/item.response.dto';

describe('ItemController (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;

  let store: StoreResponseDto;
  let menu: MenuResponseDto;

  const createStoreDto: CreateStoreDto = {
    name: 'Test Store',
    address: '123 Test St',
  };

  const createMenuDto: CreateMenuDto = {
    name: 'Test Menu',
    description: 'A test menu',
  };

  const createItemDto: CreateItemDto = {
    name: 'Test Item',
    description: 'A test item',
    price: 10.99,
    type: ItemType.FOOD,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);

    await resetDatabase(dataSource);
  });

  beforeEach(async () => {
    // Create a store
    const storeResponse = await request(app.getHttpServer())
      .post('/stores')
      .send(createStoreDto)
      .expect(201);
    store = storeResponse.body as StoreResponseDto;

    // Create a menu
    const menuResponse = await request(app.getHttpServer())
      .post(`/stores/${store.id}/menus`)
      .send(createMenuDto)
      .expect(201);
    menu = menuResponse.body as MenuResponseDto;
  });

  afterAll(async () => {
    await app.close();
  });

  // Test suite for creating an item
  describe('POST /stores/:storeId/items', () => {
    it('should create a new item successfully', async () => {
      const itemToCreate = { ...createItemDto, menuId: menu.id };

      const response = await request(app.getHttpServer())
        .post(`/stores/${store.id}/items`)
        .send(itemToCreate)
        .expect(201);

      const body = response.body as ItemResponseDto;
      expect(body).toBeDefined();
      expect(body.name).toEqual(createItemDto.name);
      expect(body.price).toEqual(createItemDto.price);
    });

    it('should fail if required fields are missing', async () => {
      await request(app.getHttpServer())
        .post(`/stores/${store.id}/items`)
        .send({ name: 'Incomplete Item' })
        .expect(400);
    });

    it('should fail with invalid data types', async () => {
      const invalidItem = { ...createItemDto, price: 'not-a-number' };
      await request(app.getHttpServer())
        .post(`/stores/${store.id}/items`)
        .send(invalidItem)
        .expect(400);
    });

    it('should fail if name is not unique for the store', async () => {
      // Create first item
      await request(app.getHttpServer())
        .post(`/stores/${store.id}/items`)
        .send({ ...createItemDto, menuId: menu.id })
        .expect(201);

      // Attempt to create another with the same name
      await request(app.getHttpServer())
        .post(`/stores/${store.id}/items`)
        .send({ ...createItemDto, menuId: menu.id, name: 'Test Item' })
        .expect(409);
    });
  });

  // Test suite for getting items
  describe('GET /stores/:storeId/items', () => {
    beforeEach(async () => {
      // Create some items
      const res1 = await request(app.getHttpServer())
        .post(`/stores/${store.id}/items`)
        .send({ ...createItemDto, name: 'Burger', menuId: menu.id });

      const res2 = await request(app.getHttpServer())
        .post(`/stores/${store.id}/items`)
        .send({ ...createItemDto, name: 'Fries', menuId: menu.id });
      const item1 = res1.body as ItemResponseDto;
      const item2 = res2.body as ItemResponseDto;

      expect(item1).toBeDefined();
      expect(item2).toBeDefined();
      expect(item1.name).toEqual('Burger');
      expect(item2.name).toEqual('Fries');
    });

    it('should get all items for a store', async () => {
      const response = await request(app.getHttpServer())
        .get(`/stores/${store.id}/items`)
        .expect(200);

      const body = response.body as ItemResponseDto[];
      expect(body).toHaveLength(2);
      expect(body.map((item: ItemResponseDto) => item.name)).toContain(
        'Burger',
      );
      expect(body.map((item: ItemResponseDto) => item.name)).toContain('Fries');
    });

    it('should filter items by menuId', async () => {
      const response = await request(app.getHttpServer())
        .get(`/stores/${store.id}/items?menuId=${menu.id}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
    });

    it('should return an empty array if menuId has no items', async () => {
      // Create another menu
      const otherMenuResponse = await request(app.getHttpServer())
        .post(`/stores/${store.id}/menus`)
        .send({ name: 'Empty Menu' })
        .expect(201);
      const otherMenu = otherMenuResponse.body as MenuResponseDto;

      const response = await request(app.getHttpServer())
        .get(`/stores/${store.id}/items?menuId=${otherMenu.id}`)
        .expect(200);

      expect(response.body).toHaveLength(0);
    });
  });

  // Test suite for getting a single item
  describe('GET /stores/:storeId/items/:id', () => {
    let item: ItemResponseDto;

    beforeEach(async () => {
      const res = await request(app.getHttpServer())
        .post(`/stores/${store.id}/items`)
        .send({ ...createItemDto, menuId: menu.id });
      item = res.body as ItemResponseDto;
    });

    it('should get an item by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/stores/${store.id}/items/${item.id}`)
        .expect(200);

      const body = response.body as ItemResponseDto;
      expect(body.id).toEqual(item.id);
      expect(body.name).toEqual(createItemDto.name);
    });

    it('should return 404 for a non-existent item', async () => {
      const nonExistentId = 'b2d8f9e0-8b5c-4e7a-9a0e-4d5f6a7b8c9d';
      await request(app.getHttpServer())
        .get(`/stores/${store.id}/items/${nonExistentId}`)
        .expect(404);
    });
  });

  // Test suite for updating an item
  describe('PUT /stores/:storeId/items/:id', () => {
    let item: ItemResponseDto;

    beforeEach(async () => {
      const res = await request(app.getHttpServer())
        .post(`/stores/${store.id}/items`)
        .send({ ...createItemDto, menuId: menu.id });
      item = res.body as ItemResponseDto;
    });

    it('should update an item successfully', async () => {
      const updateDto: UpdateItemDto = {
        name: 'Updated Item Name',
        price: 15.99,
      };
      const response = await request(app.getHttpServer())
        .put(`/stores/${store.id}/items/${item.id}`)
        .send(updateDto)
        .expect(200);

      const body = response.body as ItemResponseDto;
      expect(body.name).toEqual(updateDto.name);
      expect(body.price).toEqual(updateDto.price);
    });

    it('should fail with invalid data for update', async () => {
      const invalidUpdate = { price: 'invalid-price' };
      await request(app.getHttpServer())
        .put(`/stores/${store.id}/items/${item.id}`)
        .send(invalidUpdate)
        .expect(400);
    });
  });

  // Test suite for deleting an item
  describe('DELETE /stores/:storeId/items/:id', () => {
    let item: ItemResponseDto;

    beforeEach(async () => {
      const res = await request(app.getHttpServer())
        .post(`/stores/${store.id}/items`)
        .send({ ...createItemDto, menuId: menu.id });
      item = res.body as ItemResponseDto;
    });

    it('should delete an item successfully', async () => {
      await request(app.getHttpServer())
        .delete(`/stores/${store.id}/items/${item.id}`)
        .expect(200);

      // Verify it's gone
      await request(app.getHttpServer())
        .get(`/stores/${store.id}/items/${item.id}`)
        .expect(404);
    });

    it('should return 404 when trying to delete a non-existent item', async () => {
      const nonExistentId = 'b2d8f9e0-8b5c-4e7a-9a0e-4d5f6a7b8c9d';
      await request(app.getHttpServer())
        .delete(`/stores/${store.id}/items/${nonExistentId}`)
        .expect(404);
    });
  });
});
