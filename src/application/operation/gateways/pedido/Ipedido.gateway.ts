import { ListarPedidoDto } from "src/core/pedido/dto/listar-pedido.dto";
import { Pedido } from "src/core/pedido/entity/pedido.entity";

export interface IPedidoGateway {
  cadastrarPedido(pediodo: Pedido): Promise<void>;
  listarPedido(pedidosIds: ListarPedidoDto): Promise<Pedido[]>;
  editarStatusPedido(id: string, status: String): Promise<Pedido>;
}

export const IPedidoGateway = Symbol('IPedidoGateway');