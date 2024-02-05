import { IsIn, IsOptional, IsString } from 'class-validator';
import { DishType } from './dish.type';
import { Dish, DishCategoryENUM } from '../entity/dish.entity';

export class CreateDishDTO {
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsString()
  price: string;
  @IsIn(DishType)
  category: DishCategoryENUM;
  @IsOptional()
  file?: string;
}

export function createDishDTOToDish(createDishDTO: CreateDishDTO): Dish {
  return new Dish({
    name: createDishDTO.name,
    description: createDishDTO.description,
    price: Number(createDishDTO.price),
    category: createDishDTO.category,
    file: createDishDTO.file,
  });
}
