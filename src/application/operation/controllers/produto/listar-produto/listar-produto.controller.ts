import { Inject } from '@nestjs/common';
import { ListarProdutoDto } from '../../../../../core/produto/dto/listar-produto.dto';
import { Produto } from '../../../../../core/produto/entity/produto.entity';
import { ListarProdutoUseCase } from '../../../../../core/produto/usecase/listar-produto/listrar-produto.usecase';

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
