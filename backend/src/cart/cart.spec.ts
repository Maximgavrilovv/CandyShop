import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AuthModule } from '../auth/auth.module';
import { CandiesModule } from '../candies/candies.module';
import { CartModule } from './cart.module';
import { User } from '../auth/user.entity';
import { Candy } from '../candies/candy.entity';
import { CartItem } from './cart-item.entity';
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

describe('Cart', () => {
  let app: INestApplication;
  let users: Repository<User>;
  let candies: Repository<Candy>;
  let dataSource: DataSource;
  let token: string;
  let candyId: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
          ...DB,
          entities: [User, Candy, CartItem, Order, OrderItem],
          synchronize: true,
          retryAttempts: 3,
          retryDelay: 1000,
        }),
        AuthModule,
        CandiesModule,
        CartModule,
      ],
    }).compile();

    app = module.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    users      = module.get(getRepositoryToken(User));
    candies    = module.get(getRepositoryToken(Candy));
    dataSource = module.get(getDataSourceToken());

    if (!await users.findOneBy({ email: 'carttest@example.com' })) {
      await users.save(users.create({
        email: 'carttest@example.com',
        password: await bcrypt.hash('testpass', 10),
      }));
    }

    const candy = await candies.save(candies.create({
      name: 'Test Choc', flavour: 'Milk', description: 'Test',
      stock: 10, available: true, weight: 100,
    }));
    candyId = candy.id;

    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'carttest@example.com', password: 'testpass' });
    token = res.body.access_token;
  });

  afterAll(async () => {
    await candies?.delete({ id: candyId });
    await users?.delete({ email: 'carttest@example.com' });
    await app?.close();
    if (dataSource?.isInitialized) await dataSource.destroy();
  });

  it('401 without token', () =>
    request(app.getHttpServer()).get('/api/cart').expect(401));

  it('empty cart initially', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('adds item to cart', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ candyId, quantity: 2 })
      .expect(201);
    expect(res.body.quantity).toBe(2);
  });

  it('increments quantity on duplicate add', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ candyId, quantity: 1 })
      .expect(201);
    expect(res.body.quantity).toBe(3);
  });

  it('returns item in GET /api/cart', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.find((i: any) => i.candy?.id === candyId)).toBeDefined();
  });

  it('400 when adding unavailable candy', async () => {
    const unavail = await candies.save(candies.create({
      name: 'Unavailable', flavour: 'None', description: 'N/A',
      stock: 5, available: false, weight: 50,
    }));
    await request(app.getHttpServer())
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ candyId: unavail.id, quantity: 1 })
      .expect(400);
    await candies.delete({ id: unavail.id });
  });

  it('removes item from cart', async () => {
    const cartRes = await request(app.getHttpServer())
      .get('/api/cart')
      .set('Authorization', `Bearer ${token}`);
    const item = cartRes.body.find((i: any) => i.candy?.id === candyId);

    await request(app.getHttpServer())
      .delete(`/api/cart/items/${item.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const after = await request(app.getHttpServer())
      .get('/api/cart')
      .set('Authorization', `Bearer ${token}`);
    expect(after.body.find((i: any) => i.candy?.id === candyId)).toBeUndefined();
  });
});
