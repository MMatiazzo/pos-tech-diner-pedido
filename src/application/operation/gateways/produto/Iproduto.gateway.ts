import { ListarProdutoDto } from "src/core/produto/dto/listar-produto.dto";
import { Produto } from "src/core/produto/entity/produto.entity";

export interface IProdutoGateway {
  cadastrarProduto(produto: Produto): Promise<Produto>;
  listarProduto(listarProdutoDto: ListarProdutoDto): Promise<Produto[]>;
}

export const IProdutoGateway = Symbol('IProdutoGateway');