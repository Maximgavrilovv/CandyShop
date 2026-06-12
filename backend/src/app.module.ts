import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CandiesModule } from './candies/candies.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { User } from './auth/user.entity';
import { Candy } from './candies/candy.entity';
import { CartItem } from './cart/cart-item.entity';
import { Order } from './orders/order.entity';
import { OrderItem } from './orders/order-item.entity';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], inject: [ConfigService],
      useFactory: (c: ConfigService) => ({
        type: 'postgres',
        host: c.get('DB_HOST', 'localhost'), port: c.get<number>('DB_PORT', 5432),
        username: c.get('DB_USER', 'candy'), password: c.get('DB_PASS', 'candy'),
        database: c.get('DB_NAME', 'candy_shop'),
        entities: [User, Candy, CartItem, Order, OrderItem],
        synchronize: false,
      }),
    }),
    AuthModule, CandiesModule, CartModule, OrdersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
