import { IsString, IsUUID } from 'class-validator';

export class AddCouponDTO {
  constructor(data?: Partial<AddCouponDTO>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  @IsString()
  coupon_name: string;

  @IsUUID()
  order_id: string;
}
