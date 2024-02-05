import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DishModule } from '../../dish/module/dish.module';
import { OrderService } from '../service/order.service';
import { OrderController } from '../controller/order.controller';
import { Order } from '../Entity/order.entity';
import { MailModule } from 'src/mail/mail.module';
import { AuthModule } from 'src/auth/module/auth.module';
import { CouponModule } from '../../coupon/module/coupon.module';

@Module({
  exports: [OrderService],
  imports: [
    TypeOrmModule.forFeature([Order]),
    DishModule,
    MailModule,
    AuthModule,
    CouponModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
