import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Candy } from '../candies/candy.entity';
@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => Order, (o) => o.items, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'order_id' }) order: Order;
  @ManyToOne(() => Candy, (c) => c.orderItems, { onDelete: 'SET NULL', nullable: true }) @JoinColumn({ name: 'candy_id' }) candy: Candy | null;
  @Column({ name: 'candy_name' }) candyName: string;
  @Column() quantity: number;
}
