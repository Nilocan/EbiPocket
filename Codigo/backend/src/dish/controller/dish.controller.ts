import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { DishDTO, dishToDishDTO } from '../dto/dish.dto';
import { CreateDishDTO, createDishDTOToDish } from '../dto/create-dish.dto';
import { DishService } from '../service/dish.service';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { RolesGuard } from '../../user/roles/roles.guard';
import { Roles } from '../../user/roles/roles.decorators';
import { Role } from '../../user/roles/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import multerConfig from 'src/middleware/multer.config';

@Controller('/dish')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  @Roles(Role.EMPLOYEE, Role.ADMIN)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async createDish(
    @Body(ValidationPipe) body: CreateDishDTO,
    @UploadedFile() file,
  ): Promise<DishDTO> {
    const dish = await this.dishService.createDish(
      createDishDTOToDish({ ...body, file: file ? file.originalname : null }),
    );
    return dishToDishDTO(dish);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Put(':id')
  @Roles(Role.EMPLOYEE, Role.ADMIN)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async updateDish(
    @Param('id', new ParseUUIDPipe()) dishId,
    @Body(ValidationPipe) body: CreateDishDTO,
    @UploadedFile() file,
  ): Promise<DishDTO> {
    const dish = await this.dishService.updateDish(
      dishId,
      createDishDTOToDish({ ...body, file: file.originalname }),
    );
    return dishToDishDTO(dish);
  }

  @Get(':id')
  @Roles(Role.EMPLOYEE, Role.ADMIN)
  async getDishById(
    @Param('id', new ParseUUIDPipe()) dishId,
  ): Promise<DishDTO> {
    const dish = await this.dishService.getDishById(dishId);
    return dishToDishDTO(dish);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  @Roles(Role.EMPLOYEE, Role.ADMIN)
  async getAllDishes(): Promise<DishDTO[]> {
    const dishes = await this.dishService.getAllDishes();
    return dishes.map((d) => dishToDishDTO(d));
  }
}
