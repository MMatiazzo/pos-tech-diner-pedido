import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { GlobalExceptionFilter } from '../api/http-rest/global-exception/global.exception';
import { PedidoModule } from './pedido.module';
import { ProdutoModule } from './produto.module';
import { env } from 'process';

@Module({
  imports: [
    ProdutoModule,
    PedidoModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(env.DATABASE_URL),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ]
})
export class RootModule { }
