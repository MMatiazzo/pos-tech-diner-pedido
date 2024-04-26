import { Pedido } from "src/core/pedido/entity/pedido.entity";

export interface IPedidoRepository {
  cadastrar(pedido: Pedido): Promise<Pedido>;
  listar(matchArray: any[]): Promise<Pedido[]>;
}

export const IPedidoRepository = Symbol('IPedidoRepository');
