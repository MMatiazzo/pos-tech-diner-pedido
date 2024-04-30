import { Body, Controller, Get, HttpCode, Inject, Patch, Post, Query } from '@nestjs/common';

import { CriaPedidoDto } from 'src/core/pedido/dto/cria-pedido.dto';
import { Pedido } from 'src/core/pedido/entity/pedido.entity';

import { CadastrarPedidoController } from 'src/application/operation/controllers/pedido/cadastrar-pedido/cadastrar-pedido.controller';
import { EditarPedidoStatusController } from 'src/application/operation/controllers/pedido/editar-pedido/editar-pedido-status.controller';
import { ListarPedidoController } from 'src/application/operation/controllers/pedido/listar-pedido/listar-pedido.controller';
import { EditarPedidoDto } from 'src/core/pedido/dto/editar-pedido.dto';
import { ListarPedidoDto } from 'src/core/pedido/dto/listar-pedido.dto';

@Controller('/pedido')
export class PedidoControllerRoute {

  constructor(
    @Inject(CadastrarPedidoController)
    private cadastrarPedidoController: CadastrarPedidoController,

    @Inject(ListarPedidoController)
    private listarPedidoController: ListarPedidoController,

    @Inject(EditarPedidoStatusController)
    private editarPedidoStatusController: EditarPedidoStatusController
  ) { }

  @Post('/cadastrar')
  @HttpCode(201)
  async cadastrar(
    @Body() payload: CriaPedidoDto
  ): Promise<void> {
    await this.cadastrarPedidoController.handle(payload);
  }

  @Get('/listar')
  async listar(
    @Query() payload: ListarPedidoDto
  ): Promise<Pedido[]> {
    return this.listarPedidoController.handle(payload);
  }

  @Patch('/editar-status')
  async editarStatus(
    @Body() payload: EditarPedidoDto
  ): Promise<void> {
    await this.editarPedidoStatusController.handle(payload);
  }
}
