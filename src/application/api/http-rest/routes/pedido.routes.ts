import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';

import { CriaPedidoDto } from 'src/core/pedido/dto/cria-pedido.dto';
import { Pedido } from 'src/core/pedido/entity/pedido.entity';

import { CadastrarPedidoController } from 'src/application/operation/controllers/pedido/cadastrar-pedido/cadastrar-pedido.controller';

@Controller('/pedido')
export class PedidoControllerRoute {

  constructor(
    @Inject(CadastrarPedidoController)
    private cadastrarPedidoController: CadastrarPedidoController
  ) { }

  @Post('/cadastrar')
  @HttpCode(201)
  async cadastrar(
    @Body() payload: CriaPedidoDto
  ): Promise<Pedido> {
    return this.cadastrarPedidoController.handle(payload);
  }

  @Post('/listar')
  @HttpCode(201)
  async listar(
    @Body() payload: CriaPedidoDto
  ): Promise<Pedido[]> {
    // return this.cadastrarPedidoController.handle(payload);
    return []
  }
}
