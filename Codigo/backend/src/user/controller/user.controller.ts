import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDTO, createUserDTOToUser } from '../dto/create-user.dto';
import { UserDTO, userToUserDTO } from '../dto/user.dto';
import { UserService } from '../service/user.service';
import { Roles } from '../roles/roles.decorators';
import { Role } from '../roles/roles.enum';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { DeleteResult } from 'typeorm';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Body(ValidationPipe) body: CreateUserDTO,
  ): Promise<UserDTO> {
    const user = await this.userService.createUser(createUserDTOToUser(body));
    return userToUserDTO(user);
  }

  @Get('/employees')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.EMPLOYEE, Role.ADMIN)
  async getAllEmployees(): Promise<UserDTO[]> {
    const employees = await this.userService.getAllEmployees();

    return employees;
  }

  @Post('/employee')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.EMPLOYEE, Role.ADMIN)
  async createEmployee(
    @Body(ValidationPipe) body: CreateUserDTO,
  ): Promise<UserDTO> {
    const user = await this.userService.createEmployee(
      createUserDTOToUser(body),
    );
    return userToUserDTO(user);
  }

  @Put('/employee/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.EMPLOYEE, Role.ADMIN)
  async updateEmployee(
    @Param('id') id: string,
    @Body(ValidationPipe) body: CreateUserDTO,
  ): Promise<UserDTO> {
    const user = await this.userService.updateEmployee(
      id,
      createUserDTOToUser(body),
    );
    return userToUserDTO(user);
  }

  @Delete('/employee/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.EMPLOYEE, Role.ADMIN)
  async deleteEmployee(@Param('id') id: string): Promise<DeleteResult> {
    const result = await this.userService.deleteEmployee(id);
    return result;
  }

  @Get('/test-employee-role')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.EMPLOYEE)
  testEmployeeRole(): string {
    return 'Endpoint teste para role de employee funcionando com sucesso!';
  }
}
