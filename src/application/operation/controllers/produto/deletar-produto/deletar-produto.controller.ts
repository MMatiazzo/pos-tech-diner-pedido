import { Inject } from '@nestjs/common';
import { Produto } from 'src/core/produto/entity/produto.entity';
import { DeletarProdutoUseCase } from 'src/core/produto/usecase/deletar-produto/deletar-produto.usecase';

export class DeletarProdutoController {
  constructor(
    @Inject(DeletarProdutoUseCase)
    private deletarProdutoUseCase: DeletarProdutoUseCase
  ) { }

  async handle(id: string): Promise<Produto | null> {
    return this.deletarProdutoUseCase.execute(id);
  }
}
