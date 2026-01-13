import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { CategoryResponseDto } from '../../src/modules/categories/dtos/category.response.dto';
import { StoreResponseDto } from '../../src/modules/stores/dtos/store.response.dto';
import { App } from 'supertest/types';
import { CategoryStatus } from '../../src/modules/categories/constants/category.constant';
import { resetDatabase } from '../helpers/reset_db.helper';
import { DataSource } from 'typeorm';

describe('Category Module (e2e)', () => {
  let app: INestApplication<App>;
  let store: StoreResponseDto;
  let category: CategoryResponseDto;

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
    const storeDto = {
      name: 'Test Store for categories',
      address: '123 Test St',
    };
    const res = await request(app.getHttpServer())
      .post('/stores')
      .send(storeDto);
    store = res.body as StoreResponseDto;
  });

  afterAll(async () => {
    await app.close();
  });

  // ---------- POST /stores/:storeId/categories ----------
  describe('POST /stores/:storeId/categories', () => {
    it('should create a category successfully', async () => {
      const createCategoryDto = {
        name: 'Drinks',
        description: 'All drinks',
      };
      const res = await request(app.getHttpServer())
        .post(`/stores/${store.id}/categories`)
        .send(createCategoryDto)
        .expect(201);

      category = res.body as CategoryResponseDto;
      expect(category).toHaveProperty('id');
      expect(category.name).toBe(createCategoryDto.name);
    });

    it('should fail to create a category with missing name', async () => {
      await request(app.getHttpServer())
        .post(`/stores/${store.id}/categories`)
        .send({ description: 'No name' })
        .expect(400);
    });

    it('should fail to create a category for non-existent store', async () => {
      await request(app.getHttpServer())
        .post(`/stores/00000000-0000-0000-0000-000000000000/categories`)
        .send({ name: 'X' })
        .expect(404);
    });
  });

  // ---------- GET /stores/:storeId/categories ----------
  describe('GET /stores/:storeId/categories', () => {
    it('should get all categories for store', async () => {
      const res = await request(app.getHttpServer())
        .get(`/stores/${store.id}/categories`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(
        (res.body as CategoryResponseDto[]).some(
          (m: CategoryResponseDto) => m.id === category.id,
        ),
      ).toBe(true);
    });

    it('should return 404 if store does not exist', async () => {
      await request(app.getHttpServer())
        .get('/stores/00000000-0000-0000-0000-000000000000/categories')
        .expect(404);
    });
  });

  // ---------- GET /stores/:storeId/categories/:id ----------
  describe('GET /stores/:storeId/categories/:id', () => {
    it('should get category by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/stores/${store.id}/categories/${category.id}`)
        .expect(200);
      expect((res.body as CategoryResponseDto).id).toBe(category.id);
    });

    it('should return 404 for non-existent category', async () => {
      await request(app.getHttpServer())
        .get(
          `/stores/${store.id}/categories/00000000-0000-0000-0000-000000000000`,
        )
        .expect(404);
    });
  });

  // ---------- PUT /stores/:storeId/categories/:id ----------
  describe('PUT /stores/:storeId/categories/:id', () => {
    it('should update category', async () => {
      const updateDto = {
        name: 'Updated Drinks',
        description: 'All drinks updated',
      };
      const res = await request(app.getHttpServer())
        .put(`/stores/${store.id}/categories/${category.id}`)
        .send(updateDto)
        .expect(200);
      const body = res.body as CategoryResponseDto;
      expect(body.name).toBe(updateDto.name);
      expect(body.description).toBe(updateDto.description);
    });

    it('should fail to update with invalid data', async () => {
      await request(app.getHttpServer())
        .put(`/stores/${store.id}/categories/${category.id}`)
        .send({ name: '' })
        .expect(400);
    });
  });

  // ---------- PUT /stores/:storeId/categories/:id/disable ----------
  describe('PUT /stores/:storeId/categories/:id/disable', () => {
    it('should disable category', async () => {
      const res = await request(app.getHttpServer())
        .put(`/stores/${store.id}/categories/${category.id}/disable`)
        .expect(200);

      const body = res.body as CategoryResponseDto;
      expect(body.id).toBe(category.id);
      expect(body.status === CategoryStatus.INACTIVE).toBe(true);
    });
  });

  // ---------- DELETE /stores/:storeId/categories/:id ----------
  describe('DELETE /stores/:storeId/categories/:id', () => {
    it('should delete category', async () => {
      await request(app.getHttpServer())
        .delete(`/stores/${store.id}/categories/${category.id}`)
        .expect(200);
    });

    it('should return 404 when deleting already deleted category', async () => {
      await request(app.getHttpServer())
        .delete(`/stores/${store.id}/categories/${category.id}`)
        .expect(404);
    });
  });
});
