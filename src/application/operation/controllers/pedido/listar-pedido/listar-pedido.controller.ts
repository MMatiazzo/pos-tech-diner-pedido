import { Inject } from '@nestjs/common';
import { CriaPedidoDto } from 'src/core/pedido/dto/cria-pedido.dto';
import { Pedido } from 'src/core/pedido/entity/pedido.entity';
import { ListarPedidoUseCase } from 'src/core/pedido/usecase/listar-pedido/listar-pedido.usecase';

export class ListarPedidoController {
  constructor(
    @Inject(ListarPedidoUseCase)
    private listarPedidoUseCase: ListarPedidoUseCase
  ) { }

  async handle(payload: CriaPedidoDto): Promise<Pedido[]> {
    return this.listarPedidoUseCase.execute(payload);
  }
}
