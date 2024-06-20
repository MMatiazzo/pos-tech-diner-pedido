import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { IPedidoGateway } from "../../../../application/operation/gateways/pedido/Ipedido.gateway";
import { EditarPedidoDto } from "../../dto/editar-pedido.dto";
import { CardinalDirections } from "../../entity/pedido.entity";
import { IQueueGateway } from "../../../../application/operation/gateways/queue/Iqueue.gateway";
import { IProdutoGateway } from "../../../../application/operation/gateways/produto/Iproduto.gateway";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";

@Injectable()
export class EditarPedidoStatusUseCase {
  constructor(
    @Inject(IPedidoGateway)
    private pedidoGateway: IPedidoGateway,
    @Inject(IProdutoGateway)
    private produtoGateway: IProdutoGateway,
    @Inject(IQueueGateway)
    private queueGateway: IQueueGateway,
    @InjectConnection()
    private readonly connection: Connection,
  ) { }

  async execute({ id, status }: EditarPedidoDto): Promise<void> {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      console.log('entrei no editar pedido');

      const pedidoModificado = await this.pedidoGateway.editarStatusPedido(id, status, session);

      const produtos = await this.produtoGateway.listarProduto({ ids: pedidoModificado.produtosIds.join(',') })

      const pedido = {
        id: pedidoModificado.id,
        status: pedidoModificado.status,
        clienteId: pedidoModificado.clienteId,
        produtos: produtos
      }

      console.log('pedido para modificar => ', pedido);
      console.log('status => ', status);
      console.log('CardinalDirections.PAGAMENTO_CONFIRMADO => ', CardinalDirections.PAGAMENTO_CONFIRMADO);

      if (status === CardinalDirections.PAGAMENTO_CONFIRMADO) {
        await this.queueGateway.enviarMensagem(
          process.env.SQS_CRIAR_PEDIDO_PRODUCAO_QUEUE,
          pedido
        );
      }
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error);
    } finally {
      await session.endSession();
    }
  }
}
