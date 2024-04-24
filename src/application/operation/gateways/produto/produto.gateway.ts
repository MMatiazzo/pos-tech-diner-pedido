import { Inject } from "@nestjs/common";
import { Produto } from "src/core/produto/entity/produto.entity";
import { IProdutoRepository } from "src/infrastructure/persistence/repositories/produto/Iproduto.repository";
import { IProdutoGateway } from "./Iproduto.gateway";
import { ListarProdutoDto } from "src/core/produto/dto/listar-produto.dto";

export class ProdutoGateway implements IProdutoGateway {
  constructor(
    @Inject(IProdutoRepository)
    private produtoRepository: IProdutoRepository
  ) { }

  async cadastrarProduto(produto: Produto): Promise<Produto> {
    const { id } = await this.produtoRepository.cadastrar(produto);
    return {
      ...produto,
      id,
    };
  }

  async listarProduto(payload: ListarProdutoDto): Promise<Produto[]> {
    const arrayMatch = [];

    const { categoria, nome } = payload;

    if (categoria) {
      const categoriaMatch = {
        "$match": { categoria }
      }
      arrayMatch.push(categoriaMatch)
    }

    if (nome) {
      const nomeMatch = {
        "$match": { nome }
      }
      arrayMatch.push(nomeMatch)
    }

    const produtos = await this.produtoRepository.listar(arrayMatch);
    return produtos;
  }
}