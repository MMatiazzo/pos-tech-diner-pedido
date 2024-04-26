import { Produto } from "src/core/produto/entity/produto.entity";

export type CriaPedidoDto = {
  produtosIds: string[];
};

export type NewPedidoDto = {
  status: string;
  produtosIds: string[];
  cpf?: string;
  email?: string;
}
