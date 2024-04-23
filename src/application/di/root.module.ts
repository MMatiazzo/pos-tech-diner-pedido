import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ProdutoModule } from './produto.module';

@Module({
  imports: [
    ProdutoModule,
    ConfigModule.forRoot(),
  ],
  controllers: [],
})
export class RootModule { }
