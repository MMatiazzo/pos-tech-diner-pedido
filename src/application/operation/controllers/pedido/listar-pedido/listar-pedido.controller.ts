import { Inject } from '@nestjs/common';
import { ListarPedidoDto } from '../../../../../core/pedido/dto/listar-pedido.dto';
import { Pedido } from '../../../../../core/pedido/entity/pedido.entity';
import { ListarPedidoUseCase } from '../../../../../core/pedido/usecase/listar-pedido/listar-pedido.usecase';

export class ListarPedidoController {
  constructor(
    @Inject(ListarPedidoUseCase)
    private listarPedidoUseCase: ListarPedidoUseCase
  ) { }

  async handle(payload: ListarPedidoDto): Promise<Pedido[]> {
    return this.listarPedidoUseCase.execute(payload);
  }
}
