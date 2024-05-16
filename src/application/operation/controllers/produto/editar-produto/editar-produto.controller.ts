import { Inject } from '@nestjs/common';
import { EditarProdutoDto } from '../../../../../core/produto/dto/editar-produto.dto';
import { EditarProdutoUseCase } from '../../../../../core/produto/usecase/editar-produto/editar-produto.usecase';

export class EditarProdutoController {
  constructor(
    @Inject(EditarProdutoUseCase)
    private editarProdutoUseCase: EditarProdutoUseCase
  ) { }

  async handle(payload: EditarProdutoDto): Promise<void> {
    await this.editarProdutoUseCase.execute(payload);
  }
}
