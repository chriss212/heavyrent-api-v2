import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { User } from '../src/users/user.entity/user.entity';
import { Machine } from '../src/machines/machine.entity/machine.entity';
import { RentalRequest } from '../src/rentals/rental-request.entity/rental-request.entity';
import { Repository } from 'typeorm';

describe('API Express', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Machine, RentalRequest],
          synchronize: true,
          dropSchema: true,
        }),
        UsersModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('GET /users', () => {
    it('debe retornar un array vacío si no hay usuarios', async () => {
      const res = await request(app.getHttpServer()).get('/users');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('POST /users', () => {
    it('debe crear un usuario correctamente', async () => {
      const userData = { name: 'Juan', email: 'juan@example.com' };
      const res = await request(app.getHttpServer())
        .post('/users')
        .send(userData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe(userData.name);
      expect(res.body.email).toBe(userData.email);
    });
  });

  describe('GET /users/:id', () => {
    it('debe retornar un usuario existente por ID', async () => {
      const user = userRepository.create({ name: 'Ana', email: 'ana@example.com' });
      await userRepository.save(user);
      const res = await request(app.getHttpServer()).get(`/users/${user.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', user.id);
      expect(res.body).toHaveProperty('name', user.name);
      expect(res.body).toHaveProperty('email', user.email);
    });
  });

  describe('DELETE /users/:id', () => {
    it('debe eliminar un usuario existente', async () => {
      const user = userRepository.create({ name: 'Pedro', email: 'pedro@example.com' });
      await userRepository.save(user);
      const res = await request(app.getHttpServer()).delete(`/users/${user.id}`);
      expect([200, 204]).toContain(res.status);
    });
  });
}); 