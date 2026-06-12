import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CartItem } from '../cart/cart-item.entity';
import { Order } from '../orders/order.entity';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) email: string;
  @Column() password: string;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @OneToMany(() => CartItem, (i) => i.user) cartItems: CartItem[];
  @OneToMany(() => Order, (o) => o.user) orders: Order[];
}
