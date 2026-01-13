import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { MenuResponseDto } from '../../src/modules/menus/dtos/menu.response.dto';
import { StoreResponseDto } from '../../src/modules/stores/dtos/store.response.dto';
import { App } from 'supertest/types';
import { MenuStatus } from '../../src/modules/menus/constants/menu.constant';
import { resetDatabase } from '../helpers/reset_db.helper';
import { DataSource } from 'typeorm';

describe('Menu Module (e2e)', () => {
  let app: INestApplication<App>;
  let store: StoreResponseDto;
  let menu: MenuResponseDto;

  // Setup NestJS app + ValidationPipe
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

    // Reset DB before tests
    await resetDatabase(app.get(DataSource));

    // ---------- Create a store first ----------
    const storeDto = { name: 'Test Store for menus', address: '123 Test St' };
    const res = await request(app.getHttpServer())
      .post('/stores')
      .send(storeDto);
    store = res.body as StoreResponseDto;
  });

  afterAll(async () => {
    await app.close();
  });

  // ---------- POST /stores/:storeId/menus ----------
  describe('POST /stores/:storeId/menus', () => {
    it('should create a menu successfully', async () => {
      const createMenuDto = {
        name: 'Drinks',
        description: 'All drinks',
      };
      const res = await request(app.getHttpServer())
        .post(`/stores/${store.id}/menus`)
        .send(createMenuDto)
        .expect(201);

      menu = res.body as MenuResponseDto;
      expect(menu).toHaveProperty('id');
      expect(menu.name).toBe(createMenuDto.name);
    });

    it('should fail to create a menu with missing name', async () => {
      await request(app.getHttpServer())
        .post(`/stores/${store.id}/menus`)
        .send({ description: 'No name' })
        .expect(400);
    });

    it('should fail to create a menu for non-existent store', async () => {
      await request(app.getHttpServer())
        .post(`/stores/00000000-0000-0000-0000-000000000000/menus`)
        .send({ name: 'X' })
        .expect(404);
    });
  });

  // ---------- GET /stores/:storeId/menus ----------
  describe('GET /stores/:storeId/menus', () => {
    it('should get all menus for store', async () => {
      const res = await request(app.getHttpServer())
        .get(`/stores/${store.id}/menus`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(
        (res.body as MenuResponseDto[]).some(
          (m: MenuResponseDto) => m.id === menu.id,
        ),
      ).toBe(true);
    });

    it('should return 404 if store does not exist', async () => {
      await request(app.getHttpServer())
        .get('/stores/00000000-0000-0000-0000-000000000000/menus')
        .expect(404);
    });
  });

  // ---------- GET /stores/:storeId/menus/:id ----------
  describe('GET /stores/:storeId/menus/:id', () => {
    it('should get menu by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/stores/${store.id}/menus/${menu.id}`)
        .expect(200);
      expect((res.body as MenuResponseDto).id).toBe(menu.id);
    });

    it('should return 404 for non-existent menu', async () => {
      await request(app.getHttpServer())
        .get(`/stores/${store.id}/menus/00000000-0000-0000-0000-000000000000`)
        .expect(404);
    });
  });

  // ---------- PUT /stores/:storeId/menus/:id ----------
  describe('PUT /stores/:storeId/menus/:id', () => {
    it('should update menu', async () => {
      const updateDto = {
        name: 'Updated Drinks',
        description: 'All drinks updated',
      };
      const res = await request(app.getHttpServer())
        .put(`/stores/${store.id}/menus/${menu.id}`)
        .send(updateDto)
        .expect(200);
      const body = res.body as MenuResponseDto;
      expect(body.name).toBe(updateDto.name);
      expect(body.description).toBe(updateDto.description);
    });

    it('should fail to update with invalid data', async () => {
      await request(app.getHttpServer())
        .put(`/stores/${store.id}/menus/${menu.id}`)
        .send({ name: '' })
        .expect(400);
    });
  });

  // ---------- PUT /stores/:storeId/menus/:id/disable ----------
  describe('PUT /stores/:storeId/menus/:id/disable', () => {
    it('should disable menu', async () => {
      const res = await request(app.getHttpServer())
        .put(`/stores/${store.id}/menus/${menu.id}/disable`)
        .expect(200);

      const body = res.body as MenuResponseDto;
      expect(body.id).toBe(menu.id);
      expect(body.status === MenuStatus.INACTIVE).toBe(true);
    });
  });

  // ---------- DELETE /stores/:storeId/menus/:id ----------
  describe('DELETE /stores/:storeId/menus/:id', () => {
    it('should delete menu', async () => {
      await request(app.getHttpServer())
        .delete(`/stores/${store.id}/menus/${menu.id}`)
        .expect(200);
    });

    it('should return 404 when deleting already deleted menu', async () => {
      await request(app.getHttpServer())
        .delete(`/stores/${store.id}/menus/${menu.id}`)
        .expect(404);
    });
  });
});
