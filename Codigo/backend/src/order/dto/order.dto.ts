import { DishDTO, dishToDishDTO } from 'src/dish/dto/dish.dto';
import { Menu } from 'src/menu/entity/menu.entity';
import { User } from 'src/user/entity/user.entity';
import { Address } from 'src/address/entity/address.entity';
import { Order } from '../Entity/order.entity';

export class AddDishToOrderDTO {
  dishesIds: string[];
  orderId: string;
}

export class OrderDTO {
  constructor(data?: Partial<OrderDTO>) {
    if (data) {
      Object.assign(this, data);
    }
  }
  id: string;
  previousPrice?: number;
  totalPrice?: number;

  status?: string;

  createdAt: Date;

  userId: User;

  menuId: Menu;

  addressId: Address;

  dishes?: DishDTO[];
  couponName: string;
}

export class CreateOrderDTO {
  dishesIds: string[];
  orderId: string;
}

export function orderToOrderDTO(order: Order): OrderDTO {
  let totalPrice = order.totalPrice ?? 0;
  let previousPrice = null;
  if (order.coupon && order.totalPrice !== 0) {
    previousPrice = order.totalPrice;
    totalPrice = order.totalPrice * (1 - order.coupon.discount / 100);
  }
  return new OrderDTO({
    id: order.id,
    totalPrice: totalPrice,
    userId: order.userId,
    status: order.status,
    createdAt: order.createdAt,
    dishes: order.dishes ? order.dishes.map((d) => dishToDishDTO(d)) : [],
    menuId: order.menuId,
    addressId: order.address,
    couponName: order.coupon ? order.coupon.name : undefined,
    previousPrice: previousPrice,
  });
}

export function createOrderDTOToOrder(createOrderDTO: OrderDTO): Order {
  return new Order({
    id: createOrderDTO.id,
    totalPrice: createOrderDTO.totalPrice ?? 0,
    status: createOrderDTO.status,
    createdAt: createOrderDTO.createdAt,
    menuId: createOrderDTO.menuId,
    userId: createOrderDTO.userId,
    address: createOrderDTO.addressId,
  });
}
