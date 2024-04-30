import { Inject, Injectable } from "@nestjs/common";
import { IPedidoGateway } from "src/application/operation/gateways/pedido/Ipedido.gateway";
import { EditarPedidoDto } from "../../dto/editar-pedido.dto";

@Injectable()
export class EditarPedidoStatusUseCase {
  constructor(
    @Inject(IPedidoGateway)
    private pedidoGateway: IPedidoGateway
  ) { }

  async execute({ id, status }: EditarPedidoDto): Promise<void> {
    const pedidoModificado = await this.pedidoGateway.editarStatusPedido(id, status);

    // -- MANDAR PARA O MS DE PRODUCAO os detalhes do pedido juntamente com o pedido já modificado --
  }
}
