import { BadRequestException, Inject, Injectable } from "@nestjs/common";

import { IProdutoGateway } from "../../../application/operation/gateways/produto/Iproduto.gateway";
import { ProdutoDto } from "../dto/cria-produto.dto";
import { Produto } from "../entity/produto.entity";

@Injectable()
export class CadastrarProdutoUseCase {
  constructor(
    @Inject(IProdutoGateway)
    private produtoGateway: IProdutoGateway
  ) { }

  async execute(payload: ProdutoDto): Promise<Produto> {
    console.log('-=-=- PRODUTO USECASE -=-=-');
    const produto = Produto.new(payload);
    if (produto.nome === "" || produto.preco <= 0 || produto.categoria === "") {
      throw new BadRequestException("Produto não contém todas os atributos necessários");
    }
    const produtoCreated = await this.produtoGateway.cadastrarProduto(produto);
    return produtoCreated;
  }
}
