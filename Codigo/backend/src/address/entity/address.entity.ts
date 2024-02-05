import { Order } from 'src/order/Entity/order.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

interface AddressObject {
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
}

@Entity()
export class Address {
  constructor(data?: Partial<Address>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.addresses)
  user: User;

  @OneToMany(() => Order, (order) => order.address)
  orders?: Order[];

  @Column({ type: 'json' })
  address: AddressObject;
}
