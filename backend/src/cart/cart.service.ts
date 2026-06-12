import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { Candy } from '../candies/candy.entity';
import { AddToCartDto } from './cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem) private readonly cartItems: Repository<CartItem>,
    @InjectRepository(Candy) private readonly candies: Repository<Candy>,
  ) {}

  getCart(userId: string): Promise<CartItem[]> {
    return this.cartItems.find({ where: { user: { id: userId } }, relations: ['candy'], order: { createdAt: 'ASC' } });
  }

  async addItem(userId: string, dto: AddToCartDto): Promise<CartItem> {
    const candy = await this.candies.findOneBy({ id: dto.candyId });
    if (!candy) throw new NotFoundException('Candy not found');
    if (!candy.buyable) throw new BadRequestException(`"${candy.name}" is not available for purchase`);
    const existing = await this.cartItems.findOne({ where: { user: { id: userId }, candy: { id: dto.candyId } } });
    if (existing) { existing.quantity += dto.quantity; return this.cartItems.save(existing); }
    return this.cartItems.save(this.cartItems.create({ user: { id: userId }, candy, quantity: dto.quantity }));
  }

  async removeItem(userId: string, itemId: string): Promise<void> {
    const item = await this.cartItems.findOne({ where: { id: itemId, user: { id: userId } } });
    if (!item) throw new NotFoundException('Cart item not found');
    await this.cartItems.remove(item);
  }
}
