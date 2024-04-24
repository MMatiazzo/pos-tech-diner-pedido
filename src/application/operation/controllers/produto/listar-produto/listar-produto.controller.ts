import { Inject } from '@nestjs/common';
import { ProdutoDto } from 'src/core/produto/dto/cria-produto.dto';
import { Produto } from 'src/core/produto/entity/produto.entity';
import { CadastrarProdutoUseCase } from '../../../../../core/produto/usecase/cadastrar-produto/cadastrar-produto.usecase';
import { ListarProdutoUseCase } from 'src/core/produto/usecase/listar-produto/listrar-produto.usecase';
import { ListarProdutoDto } from 'src/core/produto/dto/listar-produto.dto';

export class ListarProdutoController {
  constructor(
    @Inject(ListarProdutoUseCase)
    private listarProdutoUseCase: ListarProdutoUseCase
  ) { }

  async handle(payload: ListarProdutoDto): Promise<Produto[]> {
    const produtos = await this.listarProdutoUseCase.execute(payload);
    return produtos;
  }
}
