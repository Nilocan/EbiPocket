import { UserDTO } from 'src/user/dto/user.dto';
import { Address } from '../entity/address.entity';
import { OrderDTO } from 'src/order/dto/order.dto';
import { User } from 'src/user/entity/user.entity';

export class AddressDTO {
  constructor(data?: Partial<AddressDTO>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  id: string;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  user: UserDTO;
  orders?: OrderDTO[];
}

export class CreateAddressDTO {
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  userId: string;
}

export function addressToAdressDTO(address: Address) {
  return new AddressDTO({
    id: address.id,
    ...address.address,
  });
}

export function addressDTOToAddress(dto: AddressDTO) {
  const { id, ...address } = dto;
  return new Address({
    id,
    address: { ...address },
  });
}

export function createAddressDTOToAddress(dto: CreateAddressDTO) {
  return new Address({
    user: new User({ id: dto.userId }),
    address: {
      ...dto,
    },
  });
}
