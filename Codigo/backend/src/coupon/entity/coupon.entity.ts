import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from '../../order/Entity/order.entity';

@Entity()
export class Coupon {
  constructor(data?: Partial<Coupon>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  @PrimaryColumn()
  name: string;

  @Column({ type: 'float' })
  discount: number;

  @Column({ type: 'float' })
  minValue: number;

  @OneToMany(() => Order, (order) => order.coupon)
  orders: Order[];
}
