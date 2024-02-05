import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../roles/roles.enum';
import { Address } from 'src/address/entity/address.entity';
import { Order } from 'src/order/Entity/order.entity';

@Entity()
export class User {
  constructor(data?: Partial<User>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 11, nullable: true })
  cpf: string;

  @Column({ type: 'varchar', length: 255, default: Role.CUSTOMER })
  role: string;

  @OneToMany(() => Order, (order) => order.userId)
  orders: Order[];

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];
}
