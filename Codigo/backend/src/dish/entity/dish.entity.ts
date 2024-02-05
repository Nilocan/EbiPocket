import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Menu } from '../../menu/entity/menu.entity';
import { Order } from 'src/order/Entity/order.entity';

@Entity()
export class Dish {
  constructor(data?: Partial<Dish>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;
  @Column({ type: 'text' })
  description: string;
  @Column({ type: 'float' })
  price: number;
  @Column({ type: 'varchar', length: 255 })
  category: DishCategoryENUM;

  @Column({ type: 'text' })
  file: string;

  @ManyToMany(() => Menu, (menu) => menu)
  @JoinTable({
    name: 'menu_dish',
    joinColumn: { name: 'dish_id' },
    inverseJoinColumn: { name: 'menu_id' },
  })
  menus: Menu[];

  @ManyToMany(() => Order, (order) => order)
  @JoinTable({
    name: 'order_dish',
    joinColumn: { name: 'dish_id' },
    inverseJoinColumn: { name: 'order_id' },
  })
  orders: Order[];
}

export enum DishCategoryENUM {
  APPETIZER = 'appetizer',
  TO_SHARE = 'toShare',
  MAIN_DISH = 'mainDish',
  DESSERT = 'dessert',
}
