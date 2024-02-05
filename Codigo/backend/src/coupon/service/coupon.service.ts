import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Coupon } from '../entity/coupon.entity';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}

  async createCoupon(coupon: Coupon): Promise<Coupon> {
    return this.couponRepository.save(coupon);
  }

  async getCouponByName(couponName: string): Promise<Coupon> {
    return this.couponRepository.findOne({ where: { name: couponName } });
  }

  async getAllCoupons(): Promise<Coupon[]> {
    return this.couponRepository.find();
  }

  async deleteCoupon(couponName: string): Promise<DeleteResult> {
    return this.couponRepository.delete({ name: couponName });
  }
}
