import { Inject } from '@nestjs/common';
import { CriaPedidoDto } from 'src/core/pedido/dto/cria-pedido.dto';
import { Pedido } from 'src/core/pedido/entity/pedido.entity';
import { CadastrarPedidoUseCase } from 'src/core/pedido/usecase/cadastrar-pedido/cadastrar-pedido.usecase';

export class CadastrarPedidoController {
  constructor(
    @Inject(CadastrarPedidoUseCase)
    private cadastrarPedidoUseCase: CadastrarPedidoUseCase
  ) { }

  async handle(payload: CriaPedidoDto): Promise<Pedido> {
    return this.cadastrarPedidoUseCase.execute(payload);
  }
}
