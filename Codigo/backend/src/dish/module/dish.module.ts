import { Module } from '@nestjs/common';
import { DishService } from '../service/dish.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from '../entity/dish.entity';
import { DishController } from '../controller/dish.controller';

@Module({
  exports: [DishService],
  imports: [TypeOrmModule.forFeature([Dish])],
  controllers: [DishController],
  providers: [DishService],
})
export class DishModule {}
