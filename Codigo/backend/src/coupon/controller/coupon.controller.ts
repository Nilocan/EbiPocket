import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  ValidationPipe,
  Delete,
  Param,
} from '@nestjs/common';
import { CouponService } from '../service/coupon.service';
import { CouponDTO, couponToCouponDTO } from '../dto/coupon.dto';
import {
  CreateCouponDTO,
  createCouponDTOToCoupon,
} from '../dto/create-coupon.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/user/roles/roles.guard';
import { Roles } from 'src/user/roles/roles.decorators';
import { Role } from 'src/user/roles/roles.enum';
import { DeleteResult } from 'typeorm';

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.EMPLOYEE, Role.ADMIN, Role.CUSTOMER)
@Controller('/coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  async createCoupon(
    @Body(ValidationPipe) body: CreateCouponDTO,
  ): Promise<CouponDTO> {
    const coupon = await this.couponService.createCoupon(
      createCouponDTOToCoupon(body),
    );
    return couponToCouponDTO(coupon);
  }

  @Get()
  async getAllCoupons(): Promise<CouponDTO[]> {
    const coupons = await this.couponService.getAllCoupons();

    return coupons.map((coupon) => couponToCouponDTO(coupon));
  }

  @Delete('/:couponName')
  async deleteCoupon(
    @Param('couponName') couponName: string,
  ): Promise<DeleteResult> {
    const coupon = await this.couponService.deleteCoupon(couponName);

    return coupon;
  }
}
