import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import {
  CreateAddressDTO,
  addressToAdressDTO,
  createAddressDTOToAddress,
} from '../dto/address.dto';
import { AddressService } from '../service/address.service';

@UseGuards(AuthGuard)
@Controller('/address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async createAddress(@Body(ValidationPipe) body: CreateAddressDTO) {
    const address = await this.addressService.createAddress(
      createAddressDTOToAddress(body),
    );

    return addressToAdressDTO(address);
  }

  @Get('/user/:userId')
  async getUserAddresses(@Param('userId', new ParseUUIDPipe()) userId) {
    const addresses = await this.addressService.getUserAddresses(userId);

    return addresses.map((address) => addressToAdressDTO(address));
  }
}
