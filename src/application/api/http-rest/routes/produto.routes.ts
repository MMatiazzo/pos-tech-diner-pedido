import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';

import { Produto } from 'src/core/produto/entity/produto.entity';
import { ProdutoDto } from 'src/core/produto/dto/cria-produto.dto';

import { CadastrarProdutoController } from 'src/application/operation/controllers/produto/cadastrar-produto/cadastrar-produto.controller';
import { ListarProdutoController } from 'src/application/operation/controllers/produto/listar-produto/listar-produto.controller';
import { ListarProdutoDto } from 'src/core/produto/dto/listar-produto.dto';

@Controller('/produto')
export class ProdutoControllerRoute {

  constructor(
    @Inject(CadastrarProdutoController)
    private cadastrarProdutoController: CadastrarProdutoController,

    @Inject(ListarProdutoController)
    private listarProdutoController: ListarProdutoController,
  ) { }

  @Post('/cadastrar')
  async cadastrar(
    @Body() produto: ProdutoDto
  ): Promise<Produto> {
    const produtoCriado = await this.cadastrarProdutoController.handle(produto);
    return produtoCriado;
  }

  @Get('/listar')
  async listar(
    @Query() payload: ListarProdutoDto
  ): Promise<Produto[]> {
    const produtos = await this.listarProdutoController.handle(payload);
    return produtos;
  }
}
