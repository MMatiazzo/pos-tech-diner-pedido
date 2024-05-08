import { Inject, Injectable } from "@nestjs/common";
import { IPedidoGateway } from "src/application/operation/gateways/pedido/Ipedido.gateway";
import { EditarPedidoDto } from "../../dto/editar-pedido.dto";
import { CardinalDirections } from "../../entity/pedido.entity";
import { IQueueGateway } from "src/application/operation/gateways/queue/Iqueue.gateway";
import { IProdutoGateway } from "src/application/operation/gateways/produto/Iproduto.gateway";

@Injectable()
export class EditarPedidoStatusUseCase {
  constructor(
    @Inject(IPedidoGateway)
    private pedidoGateway: IPedidoGateway,
    @Inject(IProdutoGateway)
    private produtoGateway: IProdutoGateway,
    @Inject(IQueueGateway)
    private queueGateway: IQueueGateway
  ) { }

  async execute({ id, status }: EditarPedidoDto): Promise<void> {
    const pedidoModificado = await this.pedidoGateway.editarStatusPedido(id, status);

    const produtos = await this.produtoGateway.listarProduto({ ids: pedidoModificado.produtosIds.join(',') })

    const pedido = {
      id: pedidoModificado.id,
      status: pedidoModificado.status,
      clienteId: pedidoModificado.clienteId,
      produtos: produtos
    }

    if (status === CardinalDirections.PAGAMENTO_CONFIRMADO && pedidoModificado) {
      await this.queueGateway.enviarMensagem(
        process.env.SQS_EDITAR_PEDIDO_STATUS_QUEUE,
        JSON.stringify(pedido)
      );
    }
  }
}
