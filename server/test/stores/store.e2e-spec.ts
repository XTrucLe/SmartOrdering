import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { StoreResponseDto } from '../../src/modules/stores/dtos/store.response.dto';
import { App } from 'supertest/types';
import { resetDatabase } from '../helpers/reset_db.helper';
import { DataSource } from 'typeorm';

describe('Store Module (e2e)', () => {
  let app: INestApplication<App>;
  let createdStore: StoreResponseDto;

  // Setup NestJS app + global validation pipe
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
  });

  afterAll(async () => {
    await app.close();
  });

  // ---------- POST /stores ----------
  describe('POST /stores', () => {
    // valid store creation
    it('should create a store successfully', async () => {
      const createStoreDto = {
        name: 'Test Store',
        address: '123 Test St, Test City',
      };
      const response = await request(app.getHttpServer())
        .post('/stores')
        .send(createStoreDto)
        .expect(201);

      const body = response.body as StoreResponseDto;
      expect(body).toHaveProperty('id');
      expect(body.name).toBe(createStoreDto.name);
      expect(body.address).toBe(createStoreDto.address);

      createdStore = body; // save for later tests
    });

    // empty name
    it('should fail to create a store with empty name', async () => {
      await request(app.getHttpServer())
        .post('/stores')
        .send({ name: '', address: '123 Test St' })
        .expect(400);
    });

    // missing name
    it('should fail to create a store with missing name', async () => {
      await request(app.getHttpServer())
        .post('/stores')
        .send({ address: '123 Test St' })
        .expect(400);
    });

    // optional slug field
    it('should create a store with slug', async () => {
      const createStoreDto = {
        name: 'Slug Store',
        address: '456 St',
        slug: 'slug-store',
      };
      const response = await request(app.getHttpServer())
        .post('/stores')
        .send(createStoreDto)
        .expect(201);

      const body = response.body as StoreResponseDto;
      expect(body.slug).toBe('slug-store');
    });
  });

  // ---------- GET /stores/:id & /stores/:slug ----------
  describe('GET /stores', () => {
    it('should get store by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/stores/${createdStore.id}`)
        .expect(200);

      const body = response.body as StoreResponseDto;
      expect(body.id).toBe(createdStore.id);
      expect(body.name).toBe(createdStore.name);
    });

    it('should get store by slug', async () => {
      const slug =
        createdStore.slug ||
        createdStore.name.toLowerCase().replace(/\s+/g, '-');
      const response = await request(app.getHttpServer())
        .get(`/stores/${slug}`)
        .expect(200);

      const body = response.body as StoreResponseDto;
      expect(body.name).toBe(createdStore.name);
    });

    it('should return 404 for invalid id', async () => {
      await request(app.getHttpServer())
        .get('/stores/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  // ---------- PUT /stores/:id ----------
  describe('PUT /stores/:id', () => {
    it('should update store name and address', async () => {
      const updateDto = { name: 'Updated Store', address: '999 New St' };
      const response = await request(app.getHttpServer())
        .put(`/stores/${createdStore.id}`)
        .send(updateDto)
        .expect(200);

      const body = response.body as StoreResponseDto;
      expect(body.name).toBe(updateDto.name);
      expect(body.address).toBe(updateDto.address);
    });

    it('should fail to update non-existent store', async () => {
      await request(app.getHttpServer())
        .put('/stores/00000000-0000-0000-0000-000000000000')
        .send({ name: 'X' })
        .expect(404);
    });

    it('should fail to update with invalid data', async () => {
      await request(app.getHttpServer())
        .put(`/stores/${createdStore.id}`)
        .send({ name: '' })
        .expect(400);
    });
  });

  // ---------- DELETE /stores/:id ----------
  describe('DELETE /stores/:id', () => {
    it('should delete store successfully', async () => {
      await request(app.getHttpServer())
        .delete(`/stores/${createdStore.id}`)
        .expect(200);
    });

    it('should return 404 when deleting already deleted store', async () => {
      await request(app.getHttpServer())
        .delete(`/stores/${createdStore.id}`)
        .expect(404);
    });
  });
});
