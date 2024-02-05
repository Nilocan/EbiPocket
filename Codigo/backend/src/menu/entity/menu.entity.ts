import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Dish } from '../../dish/entity/dish.entity';
import { Order } from 'src/order/Entity/order.entity';

@Entity()
export class Menu {
  constructor(data?: Partial<Menu>) {
    if (data) {
      Object.assign(this, data);
    }
  }
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ManyToMany(() => Dish, (dish) => dish, { eager: true })
  @JoinTable({
    name: 'menu_dish',
    joinColumn: { name: 'menu_id' },
    inverseJoinColumn: { name: 'dish_id' },
  })
  dishes?: Dish[];

  @OneToMany(() => Order, (order) => order.menuId)
  orders: Order[];
}
