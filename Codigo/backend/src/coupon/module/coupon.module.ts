import { Module } from '@nestjs/common';
import { CouponService } from '../service/coupon.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from '../entity/coupon.entity';
import { CouponController } from '../controller/coupon.controller';

@Module({
  exports: [CouponService],
  imports: [TypeOrmModule.forFeature([Coupon])],
  controllers: [CouponController],
  providers: [CouponService],
})
export class CouponModule {}
