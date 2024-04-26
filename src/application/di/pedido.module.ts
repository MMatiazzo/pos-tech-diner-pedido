import { Module } from "@nestjs/common";
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { IProdutoRepository } from "src/infrastructure/persistence/repositories/produto/Iproduto.repository";
import { ProdutoGateway } from "../operation/gateways/produto/produto.gateway";

import { PrismaService } from "src/infrastructure/persistence/prisma/prisma.service";
import { IPedidoRepository } from "src/infrastructure/persistence/repositories/pedido/Ipedido.repository";
import { PedidoMongoDbRepository } from "src/infrastructure/persistence/repositories/pedido/pedido-mongodb.repository";
import { ProdutoMongoDbRepository } from "src/infrastructure/persistence/repositories/produto/produto-mongodb.repository";
import { PedidoControllerRoute } from "../api/http-rest/routes/pedido.routes";
import { CadastrarPedidoController } from "../operation/controllers/pedido/cadastrar-pedido/cadastrar-pedido.controller";
import { IPedidoGateway } from "../operation/gateways/pedido/Ipedido.gateway";
import { PedidoGateway } from "../operation/gateways/pedido/pedido.gateway";
import { IProdutoGateway } from "../operation/gateways/produto/Iproduto.gateway";
import { CadastrarPedidoUseCase } from "src/core/pedido/usecase/cadastrar-pedido/cadastrar-pedido.usecase";

const persistenceProviders: Provider[] = [
  PrismaService,
  {
    provide: IProdutoRepository,
    useFactory: (prisma: PrismaService) => new ProdutoMongoDbRepository(prisma),
    inject: [PrismaService]
  },
  {
    provide: IPedidoRepository,
    useFactory: (prisma: PrismaService) => new PedidoMongoDbRepository(prisma),
    inject: [PrismaService]
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
  }
]

const useCaseProviders: Provider[] = [
  {
    provide: CadastrarPedidoUseCase,
    useFactory: (
      produtoGateway: IProdutoGateway,
      pedidoGateway: IPedidoGateway
    ) => new CadastrarPedidoUseCase(produtoGateway, pedidoGateway),
    inject: [IProdutoGateway, IPedidoGateway]
  }
]

const controllerProviders: Provider[] = [
  {
    provide: CadastrarPedidoController,
    useFactory: (
      cadastrarPedidoUseCase: CadastrarPedidoUseCase
    ) => new CadastrarPedidoController(cadastrarPedidoUseCase),
    inject: [CadastrarPedidoUseCase]
  }
]

@Module({
  imports: [],
  controllers: [PedidoControllerRoute],
  providers: [
    ...persistenceProviders,
    ...useCaseProviders,
    ...controllerProviders
  ],
})
export class PedidoModule { }