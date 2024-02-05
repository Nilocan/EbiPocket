import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuService } from '../service/menu.service';
import { MenuController } from '../controller/menu.controller';
import { Menu } from '../entity/menu.entity';
import { Module } from '@nestjs/common';
import { DishModule } from '../../dish/module/dish.module';

@Module({
  exports: [MenuService],
  imports: [TypeOrmModule.forFeature([Menu]), DishModule],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
