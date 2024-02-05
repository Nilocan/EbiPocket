import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressController } from '../controller/address.controller';
import { Address } from '../entity/address.entity';
import { AddressService } from '../service/address.service';

@Module({
  exports: [AddressService],
  imports: [TypeOrmModule.forFeature([Address])],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
