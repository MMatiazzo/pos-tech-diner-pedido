import { Inject } from '@nestjs/common';
import { ProdutoDto } from 'src/core/produto/dto/cria-produto.dto';
import { Produto } from 'src/core/produto/entity/produto.entity';
import { CadastrarProdutoUseCase } from '../../../../../core/produto/usecase/cadastrar-produto/cadastrar-produto.usecase';

export class CadastrarProdutoController {
  constructor(
    @Inject(CadastrarProdutoUseCase)
    private cadastrarProdutoUseCase: CadastrarProdutoUseCase
  ) { }

  async handle(produto: ProdutoDto): Promise<Produto> {
    const produtoCriado = await this.cadastrarProdutoUseCase.execute(produto);
    return produtoCriado;
  }
}
