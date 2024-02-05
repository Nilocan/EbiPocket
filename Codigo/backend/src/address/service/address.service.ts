import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from '../entity/address.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async createAddress(address: Address): Promise<Address> {
    return await this.addressRepository.save(address);
  }

  async getUserAddresses(userId: string): Promise<Address[]> {
    return await this.addressRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }
}
