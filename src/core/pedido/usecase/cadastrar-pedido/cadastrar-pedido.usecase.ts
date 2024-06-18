import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IProdutoGateway } from "../../../../application/operation/gateways/produto/Iproduto.gateway";
import { CriaPedidoDto } from "../../dto/cria-pedido.dto";
import { IPedidoGateway } from "../../../../application/operation/gateways/pedido/Ipedido.gateway";
import { CardinalDirections, Pedido } from "../../entity/pedido.entity";
import { IQueueGateway } from "../../../../application/operation/gateways/queue/Iqueue.gateway";
import { env } from "process";
import { Connection } from "mongoose";
import { InjectConnection } from "@nestjs/mongoose";

@Injectable()
export class CadastrarPedidoUseCase {
  constructor(
    @Inject(IProdutoGateway)
    private produtoGateway: IProdutoGateway,
    @Inject(IPedidoGateway)
    private pedidoGateway: IPedidoGateway,
    @Inject(IQueueGateway)
    private queueGateway: IQueueGateway,
    @InjectConnection()
    private readonly connection: Connection,
  ) { }

  async execute({ produtosIds }: CriaPedidoDto, authorization: string): Promise<void> {
    if (!produtosIds.length) {
      throw new BadRequestException('Não é possível fazer um pedido sem produtos');
    }

    const ids = produtosIds.join(',');
    const produtos = await this.produtoGateway.listarProduto({ ids });

    if (produtos.length !== produtosIds.length)
      throw new NotFoundException('Produto não encontrado');

    const [, token] = authorization.split(' ');

    // substituir isso aqui por um gateway
    const clienteResponse = await fetch(`${env.URL_CLIENTE_MS}/decodificar-acessToken`,
      {
        method: "post",
        body: JSON.stringify({ acessToken: token }),
        headers: { "Content-Type": "application/json" }
      },
    );

    const clienteResponseJson = await clienteResponse.json();

    console.log('cliente response => ', clienteResponseJson);
    // ate aqui

    if (!clienteResponseJson?.nome)
      throw new BadRequestException('Cliente não encontrado');

    const session = await this.connection.startSession();

    try {
      session.startTransaction();
      const pedido = Pedido.new({ produtosIds, status: CardinalDirections.AGUARDANDO_PAGAMENTO });

      const pedidoCadastrado = await this.pedidoGateway.cadastrarPedido({
        ...pedido,
        clienteId: clienteResponseJson.email
      }, session);

      console.log('pedidoCadastrado => ', pedidoCadastrado);

      await this.queueGateway.enviarMensagem(
        process.env.SQS_CRIAR_PAGAMENTO_QUEUE,
        pedidoCadastrado
      );
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
