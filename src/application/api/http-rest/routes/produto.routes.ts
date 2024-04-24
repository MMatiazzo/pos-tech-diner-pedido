import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Patch, Post, Query } from '@nestjs/common';

import { Produto } from 'src/core/produto/entity/produto.entity';
import { ProdutoDto } from 'src/core/produto/dto/cria-produto.dto';

import { CadastrarProdutoController } from 'src/application/operation/controllers/produto/cadastrar-produto/cadastrar-produto.controller';
import { ListarProdutoController } from 'src/application/operation/controllers/produto/listar-produto/listar-produto.controller';
import { ListarProdutoDto } from 'src/core/produto/dto/listar-produto.dto';
import { EditarProdutoController } from 'src/application/operation/controllers/produto/editar-produto/editar-produto.controller';
import { EditarProdutoDto } from 'src/core/produto/dto/editar-produto.dto';
import { DeletarProdutoController } from 'src/application/operation/controllers/produto/deletar-produto/deletar-produto.controller';

@Controller('/produto')
export class ProdutoControllerRoute {

  constructor(
    @Inject(CadastrarProdutoController)
    private cadastrarProdutoController: CadastrarProdutoController,

    @Inject(ListarProdutoController)
    private listarProdutoController: ListarProdutoController,

    @Inject(EditarProdutoController)
    private editarProdutoController: EditarProdutoController,

    @Inject(DeletarProdutoController)
    private deletarProdutoController: DeletarProdutoController,
  ) { }

  @Post('/cadastrar')
  @HttpCode(201)
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

  @Patch('/editar')
  @HttpCode(201)
  async editar(
    @Body() payload: EditarProdutoDto
  ): Promise<void> {
    await this.editarProdutoController.handle(payload);
  }

  @Delete('/deletar/:id')
  async deletar(
    @Param() { id }: { id: string }
  ): Promise<Produto | null> {
    return this.deletarProdutoController.handle(id);
  }
}
