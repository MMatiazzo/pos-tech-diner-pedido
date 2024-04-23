import { Body, Controller, Inject, Post } from '@nestjs/common';

import { Produto } from 'src/core/produto/entity/produto.entity';
import { ProdutoDto } from 'src/core/produto/dto/cria-produto.dto';

import { CadastrarProdutoController } from 'src/application/operation/controllers/produto/cadastrar-produto.controller';

@Controller('/produto')
export class ProdutoControllerRoute {

  constructor(
    @Inject(CadastrarProdutoController)
    private cadastrarProdutoController: CadastrarProdutoController,
  ) { }

  @Post('/cadastrar')
  async cadastrar(
    @Body() produto: ProdutoDto
  ): Promise<Produto> {
    const produtoCriado = await this.cadastrarProdutoController.handle(produto);
    // use the presenter if it's needed
    return produtoCriado;
  }
}
