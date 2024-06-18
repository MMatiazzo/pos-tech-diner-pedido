import { ListarPedidoDto } from "src/core/pedido/dto/listar-pedido.dto";
import { Pedido } from "src/core/pedido/entity/pedido.entity";

export interface IPedidoGateway {
  cadastrarPedido(pediodo: Pedido, session: any): Promise<Pedido>;
  listarPedido(pedidosIds: ListarPedidoDto): Promise<Pedido[]>;
  editarStatusPedido(id: string, status: string): Promise<Pedido>;
}

export const IPedidoGateway = Symbol('IPedidoGateway');