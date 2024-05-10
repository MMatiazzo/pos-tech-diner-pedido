import { Inject, Injectable } from "@nestjs/common";
import { IPedidoGateway } from "src/application/operation/gateways/pedido/Ipedido.gateway";
import { CriaPedidoDto } from "../../dto/cria-pedido.dto";
import { Pedido } from "../../entity/pedido.entity";
import { ListarPedidoDto } from "../../dto/listar-pedido.dto";

@Injectable()
export class ListarPedidoUseCase {
  constructor(
    @Inject(IPedidoGateway)
    private pedidoGateway: IPedidoGateway
  ) { }

  async execute({ ids }: ListarPedidoDto): Promise<Pedido[]> {
    const pedidos = await this.pedidoGateway.listarPedido({ ids });
    console.log('pedidos no listar => ', pedidos);
    return pedidos;
  }
}
