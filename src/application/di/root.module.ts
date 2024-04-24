import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ProdutoModule } from './produto.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from '../api/http-rest/global-exception/global.exception';

@Module({
  imports: [
    ProdutoModule,
    ConfigModule.forRoot(),
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
