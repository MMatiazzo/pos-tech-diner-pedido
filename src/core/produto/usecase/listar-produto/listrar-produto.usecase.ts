import { Inject, Injectable } from "@nestjs/common";

import { IProdutoGateway } from "../../../../application/operation/gateways/produto/Iproduto.gateway";
import { ListarProdutoDto } from "../../dto/listar-produto.dto";
import { Produto } from "../../entity/produto.entity";

@Injectable()
export class ListarProdutoUseCase {
  constructor(
    @Inject(IProdutoGateway)
    private produtoGateway: IProdutoGateway
  ) { }

  async execute(payload: ListarProdutoDto): Promise<Produto[]> {
    const produtos = await this.produtoGateway.listarProduto(payload);
    return produtos;
  }
}
