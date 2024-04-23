import { ProdutoDto } from "../dto/cria-produto.dto";

export class Produto {
  id?: string;
  nome: string;
  categoria: string;
  preco: number;
  descricao: string;
  imagens: string[];

  private constructor(paylod: ProdutoDto) {
    this.nome = paylod.nome;
    this.categoria = paylod.categoria;
    this.preco = paylod.preco;
    this.descricao = paylod.descricao;
    this.imagens = paylod.imagens;
  }

  public static new(payload: ProdutoDto) {
    const produto = new Produto(payload);
    return produto;
  }
}
