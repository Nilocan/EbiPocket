import { User } from '../entity/user.entity';

export class UserDTO {
  constructor(data?: Partial<UserDTO>) {
    if (data) {
      Object.assign(this, data);
    }
  }
  id: string;
  name: string;
  email: string;
  cpf: string;
  role: string;
}

export function userToUserDTO(user: User): UserDTO {
  return new UserDTO({
    id: user.id,
    name: user.name,
    email: user.email,
    cpf: user.cpf,
    role: user.role,
  });
}
