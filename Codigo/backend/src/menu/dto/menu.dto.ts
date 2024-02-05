import { DishDTO, dishToDishDTO } from '../../dish/dto/dish.dto';
import { Menu } from '../entity/menu.entity';

export class MenuDTO {
  constructor(data?: Partial<MenuDTO>) {
    if (data) {
      Object.assign(this, data);
    }
  }
  id: string;
  name: string;

  dishes: DishDTO[];
}

export function menuToMenuDTO(menu: Menu): MenuDTO {
  return new MenuDTO({
    id: menu.id,
    name: menu.name,
    dishes: menu.dishes ? menu.dishes.map((d) => dishToDishDTO(d)) : [],
  });
}
