import { IsString } from 'class-validator';
import { Menu } from '../entity/menu.entity';

export class CreateMenuDTO {
  @IsString()
  name: string;
}

export function createMenuDTOToMenu(createMenuDTO: CreateMenuDTO): Menu {
  return new Menu({
    name: createMenuDTO.name,
  });
}
