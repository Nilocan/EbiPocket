import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from '../entity/dish.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(Dish) private readonly dishRepository: Repository<Dish>,
  ) {}

  async createDish(dish: Dish): Promise<Dish> {
    return this.dishRepository.save({ ...dish, price: Number(dish.price) });
  }

  async updateDish(id: string, dish: Dish): Promise<Dish> {
    await this.dishRepository.update({ id }, dish);

    return this.dishRepository.findOne({ where: { id } });
  }

  async getAllDishesByIds(dishesIds: string[]): Promise<Dish[]> {
    return this.dishRepository.find({ where: { id: In(dishesIds) } });
  }

  async getDishById(dishId: string): Promise<Dish> {
    return this.dishRepository.findOne({ where: { id: dishId } });
  }

  async getAllDishes(): Promise<Dish[]> {
    return this.dishRepository.find();
  }
}
