import { Coupon } from '../entity/coupon.entity';

export class CouponDTO {
  constructor(data?: Partial<CouponDTO>) {
    if (data) {
      Object.assign(this, data);
    }
  }
  name: string;

  discount: number;

  minValue: number;
}

export function couponToCouponDTO(coupon: Coupon): CouponDTO {
  return new CouponDTO({
    name: coupon.name,
    discount: coupon.discount,
    minValue: coupon.minValue,
  });
}
