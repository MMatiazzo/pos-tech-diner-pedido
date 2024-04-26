import { Inject, Injectable } from "@nestjs/common";
import { IPedidoGateway } from "src/application/operation/gateways/pedido/Ipedido.gateway";
import { CriaPedidoDto } from "../../dto/cria-pedido.dto";
import { Pedido } from "../../entity/pedido.entity";

@Injectable()
export class ListarPedidoUseCase {
  constructor(
    @Inject(IPedidoGateway)
    private pedidoGateway: IPedidoGateway
  ) { }

  async execute({ produtosIds }: CriaPedidoDto): Promise<Pedido[]> {
    const pedidos = this.pedidoGateway.listarPedido({ ids: produtosIds });
    return pedidos;
  }
}
