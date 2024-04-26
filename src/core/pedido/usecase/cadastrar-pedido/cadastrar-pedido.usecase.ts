import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IProdutoGateway } from "src/application/operation/gateways/produto/Iproduto.gateway";
import { CriaPedidoDto } from "../../dto/cria-pedido.dto";
import { IPedidoGateway } from "src/application/operation/gateways/pedido/Ipedido.gateway";
import { CardinalDirections, Pedido } from "../../entity/pedido.entity";

@Injectable()
export class CadastrarPedidoUseCase {
  constructor(
    @Inject(IProdutoGateway)
    private produtoGateway: IProdutoGateway,
    @Inject(IPedidoGateway)
    private pedidoGateway: IPedidoGateway
  ) { }

  async execute({ produtosIds }: CriaPedidoDto): Promise<Pedido> {
    if (!produtosIds.length) {
      throw new BadRequestException('Não é possível fazer um pedido sem produtos');
    }

    const produtos = await this.produtoGateway.listarProduto({ ids: produtosIds });

    if (produtos.length !== produtosIds.length)
      throw new NotFoundException('Produto não encontrado');

    const pedido = Pedido.new({ produtosIds, status: CardinalDirections.AGUARDANDO_PAGAMENTO });

    const pedidoCadastrado = await this.pedidoGateway.cadastrarPedido(pedido);

    // -- MANDAR PARA O MS DE PEDIDO --

    return pedidoCadastrado;
  }
}
