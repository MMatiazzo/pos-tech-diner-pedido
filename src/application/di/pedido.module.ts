import { Module } from "@nestjs/common";
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { IProdutoRepository } from "src/infrastructure/persistence/repositories/produto/Iproduto.repository";
import { ProdutoGateway } from "../operation/gateways/produto/produto.gateway";

import { MongooseModule, getModelToken } from "@nestjs/mongoose";
import { Produto } from "@prisma/client";
import { Model } from "mongoose";
import { CadastrarPedidoUseCase } from "src/core/pedido/usecase/cadastrar-pedido/cadastrar-pedido.usecase";
import { EditarPedidoStatusUseCase } from "src/core/pedido/usecase/editar-status-pedido/editar-pedido-status.usecase";
import { ListarPedidoUseCase } from "src/core/pedido/usecase/listar-pedido/listar-pedido.usecase";
import { PedidoDocument, PedidoModel, PedidoSchema } from "src/infrastructure/persistence/mongoose/schemas/pedido/pedido.schema";
import { ProdutoDocument, ProdutoModel, ProdutoSchema } from "src/infrastructure/persistence/mongoose/schemas/produto/produto.schema";
import { IPedidoRepository } from "src/infrastructure/persistence/repositories/pedido/Ipedido.repository";
import { PedidoMongodbMongooseRepository } from "src/infrastructure/persistence/repositories/pedido/pedido-mongodb-mongoose.repository";
import { ProdutoMongodbMongooseRepository } from "src/infrastructure/persistence/repositories/produto/produto-mongodb-mongoose.repository";
import { PedidoControllerRoute } from "../api/http-rest/routes/pedido.routes";
import { CadastrarPedidoController } from "../operation/controllers/pedido/cadastrar-pedido/cadastrar-pedido.controller";
import { EditarPedidoStatusController } from "../operation/controllers/pedido/editar-pedido/editar-pedido-status.controller";
import { ListarPedidoController } from "../operation/controllers/pedido/listar-pedido/listar-pedido.controller";
import { IPedidoGateway } from "../operation/gateways/pedido/Ipedido.gateway";
import { PedidoGateway } from "../operation/gateways/pedido/pedido.gateway";
import { IProdutoGateway } from "../operation/gateways/produto/Iproduto.gateway";
import { IQueueGateway } from "../operation/gateways/queue/Iqueue.gateway";
import { SQSQueue } from "../operation/gateways/queue/aws/sqs/sqs-queue";

const persistenceProviders: Provider[] = [
  {
    provide: IProdutoRepository,
    useFactory: (produtoModel: Model<ProdutoDocument>) => new ProdutoMongodbMongooseRepository(produtoModel),
    inject: [getModelToken('produtos')]
  },
  {
    provide: IPedidoRepository,
    useFactory: (pedidoModel: Model<PedidoDocument>) => new PedidoMongodbMongooseRepository(pedidoModel),
    inject: [getModelToken('pedidos')]
  },
  {
    provide: IProdutoGateway,
    useFactory: (produtoRepository: IProdutoRepository) => new ProdutoGateway(produtoRepository),
    inject: [IProdutoRepository]
  },
  {
    provide: IPedidoGateway,
    useFactory: (pedidoRepository: IPedidoRepository) => new PedidoGateway(pedidoRepository),
    inject: [IPedidoRepository]
  },
  {
    provide: IQueueGateway,
    useFactory: () => new SQSQueue(),
    inject: []
  }
]

const useCaseProviders: Provider[] = [
  {
    provide: CadastrarPedidoUseCase,
    useFactory: (
      produtoGateway: IProdutoGateway,
      pedidoGateway: IPedidoGateway,
      queueGateway: IQueueGateway,
    ) => new CadastrarPedidoUseCase(produtoGateway, pedidoGateway, queueGateway),
    inject: [IProdutoGateway, IPedidoGateway, IQueueGateway]
  },
  {
    provide: ListarPedidoUseCase,
    useFactory: (
      pedidoGateway: IPedidoGateway
    ) => new ListarPedidoUseCase(pedidoGateway),
    inject: [IPedidoGateway]
  },
  {
    provide: EditarPedidoStatusUseCase,
    useFactory: (
      pedidoGateway: IPedidoGateway,
      produtoGateway: IProdutoGateway,
      queueGateway: IQueueGateway,
    ) => new EditarPedidoStatusUseCase(pedidoGateway, produtoGateway, queueGateway),
    inject: [IPedidoGateway, IProdutoGateway, IQueueGateway]
  }
]

const controllerProviders: Provider[] = [
  {
    provide: CadastrarPedidoController,
    useFactory: (
      cadastrarPedidoUseCase: CadastrarPedidoUseCase
    ) => new CadastrarPedidoController(cadastrarPedidoUseCase),
    inject: [CadastrarPedidoUseCase]
  },
  {
    provide: ListarPedidoController,
    useFactory: (
      listarPedidoUseCase: ListarPedidoUseCase
    ) => new ListarPedidoController(listarPedidoUseCase),
    inject: [ListarPedidoUseCase]
  },
  {
    provide: EditarPedidoStatusController,
    useFactory: (
      editarPedidoStatusUseCase: EditarPedidoStatusUseCase
    ) => new EditarPedidoStatusController(editarPedidoStatusUseCase),
    inject: [EditarPedidoStatusUseCase]
  }
]

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'produtos', schema: ProdutoSchema }]),
    MongooseModule.forFeature([{ name: 'pedidos', schema: PedidoSchema }]),
  ],
  controllers: [PedidoControllerRoute],
  providers: [
    ...persistenceProviders,
    ...useCaseProviders,
    ...controllerProviders
  ],
})
export class PedidoModule { }