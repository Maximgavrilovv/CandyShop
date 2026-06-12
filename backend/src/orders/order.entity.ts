import { CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../auth/user.entity';
import { OrderItem } from './order-item.entity';
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => User, (u) => u.orders, { onDelete: 'CASCADE', nullable: true }) @JoinColumn({ name: 'user_id' }) user: User | null;
  @OneToMany(() => OrderItem, (i) => i.order, { cascade: true, eager: true }) items: OrderItem[];
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}
