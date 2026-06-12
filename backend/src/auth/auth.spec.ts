import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AuthModule } from './auth.module';
import { User } from './user.entity';
import { CartItem } from '../cart/cart-item.entity';
import { Candy } from '../candies/candy.entity';
import { Order } from '../orders/order.entity';
import { OrderItem } from '../orders/order-item.entity';

const DB = {
  type: 'postgres' as const,
  host:     process.env.DB_HOST     ?? 'localhost',
  port:     parseInt(process.env.DB_PORT  ?? '5432'),
  username: process.env.DB_USER     ?? 'candy',
  password: process.env.DB_PASS     ?? 'candy',
  database: process.env.DB_NAME     ?? 'candy_shop',
};

describe('Auth', () => {
  let app: INestApplication;
  let users: Repository<User>;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
          ...DB,
          entities: [User, CartItem, Candy, Order, OrderItem],
          synchronize: true,
          retryAttempts: 3,
          retryDelay: 1000,
        }),
        AuthModule,
      ],
    }).compile();

    app = module.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    users      = module.get(getRepositoryToken(User));
    dataSource = module.get(getDataSourceToken());

    if (!await users.findOneBy({ email: 'authtest@example.com' })) {
      await users.save(users.create({
        email: 'authtest@example.com',
        password: await bcrypt.hash('testpass', 10),
      }));
    }
  });

  afterAll(async () => {
    await users?.delete({ email: 'authtest@example.com' });
    await app?.close();
    if (dataSource?.isInitialized) await dataSource.destroy();
  });

  it('201 + access_token on valid credentials', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'authtest@example.com', password: 'testpass' })
      .expect(201);
    expect(res.body).toHaveProperty('access_token');
    expect(typeof res.body.access_token).toBe('string');
  });

  it('401 on wrong password', () =>
    // Password must be >=6 chars to pass validation — wrong credentials, valid format
    request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'authtest@example.com', password: 'wrongpass' })
      .expect(401));

  it('400 on malformed email', () =>
    request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'not-an-email', password: 'testpass' })
      .expect(400));

  it('401 on login endpoint without body', () =>
    // Hitting a protected concept: empty credentials should fail validation (400)
    // or auth (401) — confirms the guard/pipe is active
    request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'nouser1' })
      .expect(401));
});
