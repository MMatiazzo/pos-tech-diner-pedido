import { EditarProdutoDto } from "src/core/produto/dto/editar-produto.dto";
import { ListarProdutoDto } from "src/core/produto/dto/listar-produto.dto";
import { Produto } from "src/core/produto/entity/produto.entity";

export interface IProdutoGateway {
  cadastrarProduto(produto: Produto): Promise<Produto>;
  listarProduto(listarProdutoDto: ListarProdutoDto): Promise<Produto[]>;
  editarProduto(editarProdutoDto: EditarProdutoDto): Promise<void>;
  deletarProduto(id: string): Promise<Produto | null>;
}

export const IProdutoGateway = Symbol('IProdutoGateway');