import { IsIn, IsUUID } from 'class-validator';

export class DishOperationDTO {
  @IsIn(['ADD', 'REMOVE'])
  operation: string;
  @IsUUID()
  dish_id: string;
}

export class DishesAssociationDTO {
  operations: DishOperationDTO[];
}
