import { BadRequestException, Inject, Injectable } from "@nestjs/common";

import { IProdutoGateway } from "../../../../application/operation/gateways/produto/Iproduto.gateway";
import { EditarProdutoDto } from "../../dto/editar-produto.dto";

@Injectable()
export class EditarProdutoUseCase {
  constructor(
    @Inject(IProdutoGateway)
    private produtoGateway: IProdutoGateway
  ) { }

  async execute(payload: EditarProdutoDto): Promise<void> {
    const stringTypes = ['nome', 'descricao', 'categoria'];
    const numberTypes = ['preco'];
    const stringArrayTypes = ['imagens'];

    if (
      (stringTypes.includes(payload.campo) && typeof payload.valor !== 'string') ||
      (numberTypes.includes(payload.campo) && typeof payload.valor !== 'number') ||
      (stringArrayTypes.includes(payload.campo) && Array.isArray(payload.valor))
    ) {
      throw new BadRequestException(`Campo "${payload.campo}" não está no formado correto`);
    }

    // fazer a mudanca la
    await this.produtoGateway.editarProduto(payload);
  }
}
