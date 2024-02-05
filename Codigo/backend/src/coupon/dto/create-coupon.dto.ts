import { IsNumber, IsString } from 'class-validator';
import { Coupon } from '../entity/coupon.entity';

export class CreateCouponDTO {
  @IsString()
  name: string;
  @IsNumber()
  discount: number;
  @IsNumber()
  minValue: number;
}

export function createCouponDTOToCoupon(
  createCouponDTO: CreateCouponDTO,
): Coupon {
  return new Coupon({
    name: createCouponDTO.name,
    discount: createCouponDTO.discount,
    minValue: createCouponDTO.minValue,
  });
}
