import { Inject, Injectable } from "@nestjs/common";
import { IPedidoGateway } from "src/application/operation/gateways/pedido/Ipedido.gateway";
import { EditarPedidoDto } from "../../dto/editar-pedido.dto";
import { CardinalDirections } from "../../entity/pedido.entity";
import { IQueueGateway } from "src/application/operation/gateways/queue/Iqueue.gateway";

@Injectable()
export class EditarPedidoStatusUseCase {
  constructor(
    @Inject(IPedidoGateway)
    private pedidoGateway: IPedidoGateway,
    // @Inject(IQueueGateway)
    // private queueGateway: IQueueGateway
  ) { }

  async execute({ id, status }: EditarPedidoDto): Promise<void> {
    const pedidoModificado = await this.pedidoGateway.editarStatusPedido(id, status);
    // se status === pagamento aprovado => mandar para o ms de producao

    // if (status === CardinalDirections.PAGAMENTO_CONFIRMADO) {
    //   await this.queueGateway.enviarMensagem(
    //     process.env.SQS_CRIAR_PAGAMENTO_QUEUE,
    //     JSON.stringify(pedidoModificado)
    //   );
    // }

    // -- MANDAR PARA O MS DE PRODUCAO os detalhes do pedido juntamente com o pedido já modificado --
  }
}
