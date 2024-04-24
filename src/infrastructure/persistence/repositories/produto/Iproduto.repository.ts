import { Produto } from "src/core/produto/entity/produto.entity";

export interface IProdutoRepository {
  cadastrar(produto: Produto): Promise<Produto>;
  editar(id: string, campo: string, valor: string | number | string[]): Promise<Produto | never>;
  remover(id: string): Promise<Produto | null>;
  listar(mathArray: any[]): Promise<any>;
}

export const IProdutoRepository = Symbol('IProdutoRepository');
