import { Pedido } from "src/core/pedido/entity/pedido.entity";

export interface IPedidoRepository {
  cadastrar(pedido: Pedido): Promise<void>;
  listar(matchArray: any[]): Promise<Pedido[]>;
  editar(id: string, field: string, value: string): Promise<Pedido>;
}

export const IPedidoRepository = Symbol('IPedidoRepository');
