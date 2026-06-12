import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './cart-item.entity';
import { Candy } from '../candies/candy.entity';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
@Module({ imports: [TypeOrmModule.forFeature([CartItem, Candy])], providers: [CartService], controllers: [CartController], exports: [CartService] })
export class CartModule {}
