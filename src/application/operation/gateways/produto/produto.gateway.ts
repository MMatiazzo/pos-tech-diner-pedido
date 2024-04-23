import { Inject } from "@nestjs/common";
import { Produto } from "src/core/produto/entity/produto.entity";
import { IProdutoRepository } from "src/infrastructure/persistence/repositories/produto/Iproduto.repository";
import { IProdutoGateway } from "./Iproduto.gateway";

export class ProdutoGateway implements IProdutoGateway {
  constructor(
    @Inject(IProdutoRepository)
    private produtoRepository: IProdutoRepository
  ) { }

  async cadastrarProduto(produto: Produto): Promise<Produto> {
    // cadastrar e retornar produto;
    console.log('-=-=- PRODUTO GATEWAY -=-=-');
    console.log('produto => ', produto);
    const { id } = await this.produtoRepository.cadastrar(produto);
    return {
      ...produto,
      id,
    };
  }
}