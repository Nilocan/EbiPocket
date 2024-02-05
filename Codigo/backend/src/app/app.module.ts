import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AddressModule } from 'src/address/module/address.module';
import { OrderModule } from 'src/order/module/order.module';
import { AuthModule } from '../auth/module/auth.module';
// import { HttpExceptionFilter } from '../core/errors/http-exception.filters';
import { DishModule } from '../dish/module/dish.module';
import { MenuModule } from '../menu/module/menu.module';
import { UserModule } from '../user/module/user.module';
import { TypeOrmConfigService } from './db-config/type-orm-config.service';

@Module({
  imports: [
    UserModule,
    AuthModule,
    MenuModule,
    DishModule,
    OrderModule,
    AddressModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      inject: [TypeOrmConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
