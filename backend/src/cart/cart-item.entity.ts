import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from '../auth/user.entity';
import { Candy } from '../candies/candy.entity';
@Entity('cart_items') @Unique(['user', 'candy'])
export class CartItem {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => User, (u) => u.cartItems, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'user_id' }) user: User;
  @ManyToOne(() => Candy, (c) => c.cartItems, { onDelete: 'CASCADE', eager: true }) @JoinColumn({ name: 'candy_id' }) candy: Candy;
  @Column({ default: 1 }) quantity: number;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}
