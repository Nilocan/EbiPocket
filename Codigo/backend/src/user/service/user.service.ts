import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Role } from '../roles/roles.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email: email } });
  }

  async getUserById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  async getAllEmployees(): Promise<User[]> {
    return this.userRepository.find({
      where: [{ role: 'employee' }, { role: 'admin' }],
    });
  }

  async createUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async createEmployee(user: User): Promise<User> {
    user.role = Role.EMPLOYEE;
    return this.userRepository.save(user);
  }

  async updateEmployee(id: string, user: User): Promise<User> {
    user.role = Role.EMPLOYEE;
    await this.userRepository.update({ id }, user);

    return this.userRepository.findOne({ where: { id } });
  }

  async deleteEmployee(userId: string): Promise<DeleteResult> {
    return this.userRepository.delete({
      id: userId,
    });
  }
}
