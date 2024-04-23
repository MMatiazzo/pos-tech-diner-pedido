import { Produto } from "src/core/produto/entity/produto.entity";

export interface IProdutoGateway {
  cadastrarProduto(produto: Produto): Promise<Produto>;
}

export const IProdutoGateway = Symbol('IProdutoGateway');