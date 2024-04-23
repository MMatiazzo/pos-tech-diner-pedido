import { Produto } from "src/core/produto/entity/produto.entity";

export interface IProdutoRepository {
  cadastrar(produto: Produto): Promise<Produto>;
  editar(id: string, campo: string, valor: string | number | string[]): Promise<Produto | never>;
  remover(id: string): Promise<null | Produto>;
  buscarPorCategoria(categoria: string): Promise<null | Produto[]>;
}

export const IProdutoRepository = Symbol('IProdutoRepository');
