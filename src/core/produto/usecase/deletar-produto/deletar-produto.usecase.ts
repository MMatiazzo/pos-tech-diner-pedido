import { Inject, Injectable } from "@nestjs/common";

import { IProdutoGateway } from "../../../../application/operation/gateways/produto/Iproduto.gateway";
import { Produto } from "../../entity/produto.entity";

@Injectable()
export class DeletarProdutoUseCase {
  constructor(
    @Inject(IProdutoGateway)
    private produtoGateway: IProdutoGateway
  ) { }

  async execute(id: string): Promise<Produto | null> {
    const produto = await this.produtoGateway.deletarProduto(id);
    return produto as Produto;
  }
}
