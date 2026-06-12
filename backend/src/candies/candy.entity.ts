import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CartItem } from '../cart/cart-item.entity';
import { OrderItem } from '../orders/order-item.entity';
@Entity('candies')
export class Candy {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column() flavour: string;
  @Column('text') description: string;
  @Column({ default: 0 }) stock: number;
  @Column({ default: true }) available: boolean;
  @Column() weight: number;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
  @OneToMany(() => CartItem, (i) => i.candy) cartItems: CartItem[];
  @OneToMany(() => OrderItem, (i) => i.candy) orderItems: OrderItem[];
  get buyable(): boolean { return this.available && this.stock > 0; }
}
