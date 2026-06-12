import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CartItem } from '../cart/cart-item.entity';
import { Candy } from '../candies/candy.entity';
export interface CheckoutResult { order: Order; skipped: { name: string; reason: string }[]; }

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async checkout(userId: string | null): Promise<CheckoutResult> {
    return this.dataSource.transaction(async (em) => {
      if (!userId) throw new BadRequestException('Login required to checkout');
      const cartItems = await em.find(CartItem, { where: { user: { id: userId } }, relations: ['candy'] });
      if (!cartItems.length) throw new BadRequestException('Your cart is empty');
      const orderItems: OrderItem[] = [];
      const skipped: CheckoutResult['skipped'] = [];
      for (const ci of cartItems) {
        const candy = await em.getRepository(Candy).createQueryBuilder('c').setLock('pessimistic_write').where('c.id = :id', { id: ci.candy.id }).getOne();
        if (!candy) { skipped.push({ name: ci.candy.name, reason: 'no longer exists' }); continue; }
        if (!candy.available) { skipped.push({ name: candy.name, reason: 'no longer available' }); continue; }
        if (candy.stock < ci.quantity) { skipped.push({ name: candy.name, reason: `only ${candy.stock} unit(s) left (you have ${ci.quantity} in cart)` }); continue; }
        candy.stock -= ci.quantity;
        await em.save(candy);
        orderItems.push(em.create(OrderItem, { candyName: candy.name, candy, quantity: ci.quantity }));
      }
      if (!orderItems.length) throw new BadRequestException('No items could be fulfilled. ' + skipped.map((s) => `${s.name}: ${s.reason}`).join('; '));
      const order = await em.save(em.create(Order, { user: userId ? { id: userId } : undefined, items: orderItems }));
      const fulfilledIds = new Set(orderItems.map((i) => i.candy?.id).filter(Boolean));
      await em.remove(cartItems.filter((ci) => fulfilledIds.has(ci.candy.id)));
      return { order, skipped };
    });
  }

  getOrders(userId: string): Promise<Order[]> {
    return this.orders.find({ where: { user: { id: userId } }, relations: ['items'], order: { createdAt: 'DESC' } });
  }
}
