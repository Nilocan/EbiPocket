import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from '../service/order.service';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { RolesGuard } from '../../user/roles/roles.guard';
import { Roles } from '../../user/roles/roles.decorators';
import { Role } from '../../user/roles/roles.enum';
import {
  AddDishToOrderDTO,
  OrderDTO,
  createOrderDTOToOrder,
  orderToOrderDTO,
} from '../dto/order.dto';
import {
  FilterByStatusOrderQuery,
  ORDER_STATUSES,
  OrderParams,
} from '../types/order.types';
import { AddCouponDTO } from '../dto/add-coupon.dto';

@UseGuards(AuthGuard, RolesGuard)
@Controller('/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(Role.EMPLOYEE, Role.ADMIN, Role.CUSTOMER)
  async createOrder(@Body(ValidationPipe) body: OrderDTO): Promise<OrderDTO> {
    const order = await this.orderService.persistOrder(
      createOrderDTOToOrder(body),
    );

    return orderToOrderDTO(order);
  }

  @Post('add-dishes')
  @Roles(Role.EMPLOYEE, Role.ADMIN, Role.CUSTOMER)
  async addDishesInOrder(
    @Body(ValidationPipe) body: AddDishToOrderDTO,
    @Request() req,
  ): Promise<OrderDTO> {
    const order = await this.orderService.addDishToOrder(
      body,
      req.user.username,
    );

    return orderToOrderDTO(order);
  }

  @Post('/coupon/add')
  @Roles(Role.EMPLOYEE, Role.ADMIN, Role.CUSTOMER)
  async addCouponToOrder(
    @Body(ValidationPipe) body: AddCouponDTO,
  ): Promise<void> {
    await this.orderService.addCouponToOrder(body);
  }

  @Get('/filter-status')
  @Roles(Role.EMPLOYEE, Role.ADMIN)
  async getAllOrdersByStatus(
    @Query() query: FilterByStatusOrderQuery,
  ): Promise<OrderDTO[]> {
    const orders = await this.orderService.getOrdersByStatus(query.status);
    return orders.map((o) => orderToOrderDTO(o));
  }

  @Patch('/update-status/:id')
  @Roles(Role.EMPLOYEE, Role.ADMIN)
  async updateOrderStatus(
    @Body() body: { newStatus: ORDER_STATUSES },
    @Param() params: OrderParams,
  ): Promise<{ message: string }> {
    const res = await this.orderService.updateOrderStatus(
      params.id,
      body.newStatus,
    );

    return res;
  }

  @Get(':id')
  @Roles(Role.EMPLOYEE, Role.ADMIN, Role.CUSTOMER)
  async getOrderById(
    @Param() params: OrderParams,
    @Request() req,
  ): Promise<OrderDTO> {
    const order = await this.orderService.getOrderById(params.id, req);
    return orderToOrderDTO(order);
  }

  @Get('history/:id')
  @Roles(Role.EMPLOYEE, Role.ADMIN, Role.CUSTOMER)
  async getUserOrderHistory(@Param() params: OrderParams): Promise<OrderDTO[]> {
    const dtoOrders = [];
    const orders = await this.orderService.getUserOrderHistory(params.id);
    orders.forEach((el) => {
      dtoOrders.push(orderToOrderDTO(el));
    });

    return dtoOrders;
  }
}
