import { Inject } from '@nestjs/common';
import { CriaPedidoDto } from '../../../../../core/pedido/dto/cria-pedido.dto';
import { CadastrarPedidoUseCase } from '../../../../../core/pedido/usecase/cadastrar-pedido/cadastrar-pedido.usecase';

export class CadastrarPedidoController {
  constructor(
    @Inject(CadastrarPedidoUseCase)
    private cadastrarPedidoUseCase: CadastrarPedidoUseCase
  ) { }

  async handle(payload: CriaPedidoDto, authorization: string): Promise<void> {
    return this.cadastrarPedidoUseCase.execute(payload, authorization);
  }
}
