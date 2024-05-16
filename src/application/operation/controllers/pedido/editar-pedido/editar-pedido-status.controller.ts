import { Inject } from '@nestjs/common';
import { EditarPedidoDto } from '../../../../../core/pedido/dto/editar-pedido.dto';
import { EditarPedidoStatusUseCase } from '../../../../../core/pedido/usecase/editar-status-pedido/editar-pedido-status.usecase';

export class EditarPedidoStatusController {
  constructor(
    @Inject(EditarPedidoStatusUseCase)
    private editarPedidoStatusUseCase: EditarPedidoStatusUseCase
  ) { }

  async handle(payload: EditarPedidoDto): Promise<void> {
    await this.editarPedidoStatusUseCase.execute(payload);
  }
}
