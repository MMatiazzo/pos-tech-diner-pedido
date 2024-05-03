import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IProdutoGateway } from "src/application/operation/gateways/produto/Iproduto.gateway";
import { CriaPedidoDto } from "../../dto/cria-pedido.dto";
import { IPedidoGateway } from "src/application/operation/gateways/pedido/Ipedido.gateway";
import { CardinalDirections, Pedido } from "../../entity/pedido.entity";
import { IQueueGateway } from "src/application/operation/gateways/queue/Iqueue.gateway";

@Injectable()
export class CadastrarPedidoUseCase {
  constructor(
    @Inject(IProdutoGateway)
    private produtoGateway: IProdutoGateway,
    @Inject(IPedidoGateway)
    private pedidoGateway: IPedidoGateway,
    @Inject(IQueueGateway)
    private queueGateway: IQueueGateway
  ) { }

  async execute({ produtosIds }: CriaPedidoDto): Promise<void> {
    if (!produtosIds.length) {
      throw new BadRequestException('Não é possível fazer um pedido sem produtos');
    }

    const produtos = await this.produtoGateway.listarProduto({ ids: produtosIds });

    if (produtos.length !== produtosIds.length)
      throw new NotFoundException('Produto não encontrado');

    // -- Fazer chamada para a API de cliente e pegar o email --

    const pedido = Pedido.new({ produtosIds, status: CardinalDirections.AGUARDANDO_PAGAMENTO });

    const pedidoCadastrado = await this.pedidoGateway.cadastrarPedido({ ...pedido, clienteId: null });

    await this.queueGateway.enviarMensagem(
      process.env.SQS_CRIAR_PAGAMENTO_QUEUE,
      JSON.stringify(pedidoCadastrado)
    );
  }
}
