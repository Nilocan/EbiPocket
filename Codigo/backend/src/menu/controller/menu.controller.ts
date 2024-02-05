import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateMenuDTO, createMenuDTOToMenu } from '../dto/create-menu.dto';
import { MenuDTO, menuToMenuDTO } from '../dto/menu.dto';
import { MenuService } from '../service/menu.service';
import { DishesAssociationDTO } from '../dto/dishes-id.dto';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { RolesGuard } from '../../user/roles/roles.guard';
import { Roles } from '../../user/roles/roles.decorators';
import { Role } from '../../user/roles/roles.enum';

@Controller('/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  @Roles(Role.EMPLOYEE, Role.ADMIN)
  async createMenu(
    @Body(ValidationPipe) body: CreateMenuDTO,
  ): Promise<MenuDTO> {
    const menu = await this.menuService.createMenu(createMenuDTOToMenu(body));
    return menuToMenuDTO(menu);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Post(':id/dishes')
  @Roles(Role.EMPLOYEE, Role.ADMIN)
  async addDishesInMenu(
    @Param('id', new ParseUUIDPipe()) menuId,
    @Body(ValidationPipe) body: DishesAssociationDTO,
  ): Promise<MenuDTO> {
    const menu = await this.menuService.addDishesInMenu(
      menuId,
      body.operations,
    );
    return menuToMenuDTO(menu);
  }

  @Get(':id')
  @Roles(Role.EMPLOYEE, Role.ADMIN)
  async getMenuById(
    @Param('id', new ParseUUIDPipe()) menuId,
  ): Promise<MenuDTO> {
    const menu = await this.menuService.getMenuById(menuId);
    return menuToMenuDTO(menu);
  }

  @Get()
  async getAllMenus(): Promise<MenuDTO[]> {
    const menus = await this.menuService.getAllMenus();
    return menus.map((m) => menuToMenuDTO(m));
  }
}
