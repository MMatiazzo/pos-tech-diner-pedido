import { Inject } from '@nestjs/common';
import { Produto } from '../../../../../core/produto/entity/produto.entity';
import { DeletarProdutoUseCase } from '../../../../../core/produto/usecase/deletar-produto/deletar-produto.usecase';

export class DeletarProdutoController {
  constructor(
    @Inject(DeletarProdutoUseCase)
    private deletarProdutoUseCase: DeletarProdutoUseCase
  ) { }

  async handle(id: string): Promise<Produto | null> {
    return this.deletarProdutoUseCase.execute(id);
  }
}
