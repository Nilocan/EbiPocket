import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from '../entity/menu.entity';
import { DishService } from '../../dish/service/dish.service';
import { DishOperationDTO } from '../dto/dishes-id.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
    private readonly dishService: DishService,
  ) {}

  async createMenu(menu: Menu): Promise<Menu> {
    return this.menuRepository.save(menu);
  }

  async addDishesInMenu(
    menuId: string,
    dishesOp: DishOperationDTO[],
  ): Promise<Menu> {
    const menu = await this.getMenuById(menuId);
    if (!menu.dishes) menu.dishes = [];
    const dishesIdsToBeAdded = dishesOp
      .filter((d) => d.operation === 'ADD')
      .map((d) => d.dish_id);
    await this.handleAddDishes(dishesIdsToBeAdded, menu);
    const dishesIdsToBeRemoved = new Set(
      dishesOp.filter((d) => d.operation === 'REMOVE').map((d) => d.dish_id),
    );
    menu.dishes = menu?.dishes.filter((d) => !dishesIdsToBeRemoved.has(d.id));
    return this.menuRepository.save(menu);
  }

  private async handleAddDishes(
    dishesIds: string[],
    menu: Menu,
  ): Promise<void> {
    let dishes = await this.dishService.getAllDishesByIds(dishesIds);
    const setExistingDishes = new Set(menu?.dishes.map((d) => d.id));
    dishes = dishes.filter((d) => !setExistingDishes.has(d.id));
    menu.dishes ? menu.dishes.push(...dishes) : (menu.dishes = dishes);
  }
  async getMenuById(menuId: string): Promise<Menu> {
    return this.menuRepository.findOne({ where: { id: menuId } });
  }

  async getAllMenus(): Promise<Menu[]> {
    return this.menuRepository.find();
  }
}
