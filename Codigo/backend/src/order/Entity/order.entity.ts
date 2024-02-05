import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Menu } from '../../menu/entity/menu.entity';
import { Dish } from 'src/dish/entity/dish.entity';
import { User } from 'src/user/entity/user.entity';
import { Address } from 'src/address/entity/address.entity';
import { Coupon } from '../../coupon/entity/coupon.entity';

@Entity()
export class Order {
  constructor(data?: Partial<Order>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Menu, (menu) => menu.orders, { eager: true })
  @JoinColumn({ name: 'menuId' })
  menuId: Menu;

  @ManyToOne(() => User, (user) => user.orders, { eager: true })
  @JoinColumn({ name: 'userId' })
  userId: User;

  @Column({ type: 'float', default: 0 })
  totalPrice: number;

  @Column()
  status: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @ManyToMany(() => Dish, (dish) => dish.orders, { eager: true })
  @JoinTable({
    name: 'order_dish',
    joinColumn: { name: 'order_id' },
    inverseJoinColumn: { name: 'dish_id' },
  })
  dishes?: Dish[];

  @ManyToOne(() => Address, (address) => address.orders, { eager: true })
  address: Address;

  @ManyToOne(() => Coupon, (coupon) => coupon.orders, { eager: true })
  @JoinColumn({ name: 'coupon_name' })
  coupon: Coupon;
}
