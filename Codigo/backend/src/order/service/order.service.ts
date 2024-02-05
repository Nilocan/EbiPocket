import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/service/auth.service';
import { Dish } from 'src/dish/entity/dish.entity';
import { DishService } from 'src/dish/service/dish.service';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { CouponService } from '../../coupon/service/coupon.service';
import { Order } from '../Entity/order.entity';
import { AddCouponDTO } from '../dto/add-coupon.dto';
import { AddDishToOrderDTO } from '../dto/order.dto';
import { ORDER_STATUSES } from '../types/order.types';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly dishService: DishService,
    private readonly mailService: MailService,
    private readonly authService: AuthService,
    private readonly couponService: CouponService,
  ) {}

  async persistOrder(order: Order): Promise<Order> {
    return this.orderRepository.save(order);
  }

  async addDishToOrder(createOrderDTO: AddDishToOrderDTO, username: string) {
    const order = await this.getOrderById(createOrderDTO.orderId, username);

    const dishes = await this.dishService.getAllDishesByIds(
      createOrderDTO.dishesIds,
    );
    const totalPrice = this.sumTotalOrderPrice(dishes);

    order.dishes ? order.dishes.push(...dishes) : (order.dishes = dishes);

    order.totalPrice = totalPrice;

    await this.orderRepository.save(order);
    await this.mailService.sendOrderConfirmation(username);

    return order;
  }

  async addCouponToOrder(addCoupon: AddCouponDTO): Promise<void> {
    const coupon = await this.couponService.getCouponByName(
      addCoupon.coupon_name,
    );
    const order = await this.orderRepository.findOne({
      where: { id: addCoupon.order_id },
    });
    if (coupon && order.totalPrice >= coupon.minValue) {
      await this.orderRepository.save({ ...order, coupon: coupon });
    } else {
      const message = coupon
        ? `to use the coupon the order value should be greater than ${coupon.minValue}`
        : `Coupon does not exist;`;
      throw new BadRequestException(message);
    }
  }

  private sumTotalOrderPrice(dishes: Dish[]) {
    return dishes.reduce((accumulator, dish) => accumulator + dish.price, 0);
  }

  async getOrdersByStatus(status: string) {
    return await this.orderRepository.find({
      where: {
        status,
      },
    });
  }

  async getOrderById(id: string, username: string) {
    // const userProfile = await this.authService.getUserByEmail(username);
    const order = await this.orderRepository.findOne({ where: { id } });

    // if (order.userId.email !== username && userProfile.role !== Role.EMPLOYEE) {
    //   throw new HttpException('Permissões insuficientes', 400);
    // }

    return order;
  }

  async updateOrderStatus(id: string, newStatus: ORDER_STATUSES) {
    const updateData: Partial<Order> = {
      status: newStatus,
    };

    await this.orderRepository.update({ id }, updateData);

    return {
      message: 'Pedido Atualizado com sucesso.',
    };
  }

  async getUserOrderHistory(id: string) {
    return this.orderRepository.find({
      where: {
        userId: {
          id,
        },
      },
      relations: ['userId'],
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
