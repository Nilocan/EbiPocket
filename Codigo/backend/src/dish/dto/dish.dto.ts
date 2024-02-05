import { Dish, DishCategoryENUM } from '../entity/dish.entity';
import { getDishImagePath } from '../helpers/imagePath.helpers';

export class DishDTO {
  constructor(data?: Partial<DishDTO>) {
    if (data) {
      Object.assign(this, data);
    }
  }
  id: string;
  name: string;

  description: string;

  price: number;

  category: DishCategoryENUM;

  file?: string;
}

export function dishToDishDTO(dish: Dish): DishDTO {
  return new DishDTO({
    id: dish.id,
    name: dish.name,
    description: dish.description,
    price: dish.price,
    category: dish.category,
    file: getDishImagePath(dish.file),
  });
}
