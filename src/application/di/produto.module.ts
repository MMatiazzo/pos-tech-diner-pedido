import { Module } from "@nestjs/common";
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { IProdutoRepository } from "src/infrastructure/persistence/repositories/produto/Iproduto.repository";
import { ProdutoControllerRoute } from "../api/http-rest/routes/produto.routes";
import { CadastrarProdutoController } from "../operation/controllers/produto/cadastrar-produto/cadastrar-produto.controller";
import { ProdutoGateway } from "../operation/gateways/produto/produto.gateway";

import { PrismaService } from "src/infrastructure/persistence/prisma/prisma.service";
import { ProdutoMongoDbRepository } from "src/infrastructure/persistence/repositories/produto/produto-mongodb.repository";
import { CadastrarProdutoUseCase } from "src/core/produto/usecase/cadastrar-produto/cadastrar-produto.usecase";
import { ListarProdutoUseCase } from "src/core/produto/usecase/listar-produto/listrar-produto.usecase";
import { ListarProdutoController } from "../operation/controllers/produto/listar-produto/listar-produto.controller";

const persistenceProviders: Provider[] = [
  PrismaService,
  {
    provide: IProdutoRepository,
    useFactory: (prisma: PrismaService) => new ProdutoMongoDbRepository(prisma),
    inject: [PrismaService]
  },
  {
    provide: ProdutoGateway,
    useFactory: (produtoRepository: IProdutoRepository) => new ProdutoGateway(produtoRepository),
    inject: [IProdutoRepository]
  }
]

const useCaseProviders: Provider[] = [
  {
    provide: CadastrarProdutoUseCase,
    useFactory: (produtoGateway: ProdutoGateway) => new CadastrarProdutoUseCase(produtoGateway),
    inject: [ProdutoGateway]
  },
  {
    provide: ListarProdutoUseCase,
    useFactory: (produtoGateway: ProdutoGateway) => new ListarProdutoUseCase(produtoGateway),
    inject: [ProdutoGateway]
  }
]

const controllerProviders: Provider[] = [
  {
    provide: CadastrarProdutoController,
    useFactory: (cadastrarProdutoUseCase: CadastrarProdutoUseCase) => new CadastrarProdutoController(cadastrarProdutoUseCase),
    inject: [CadastrarProdutoUseCase]
  },
  {
    provide: ListarProdutoController,
    useFactory: (listarProdutoUseCase: ListarProdutoUseCase) => new ListarProdutoController(listarProdutoUseCase),
    inject: [ListarProdutoUseCase]
  }
]

@Module({
  imports: [],
  controllers: [ProdutoControllerRoute],
  providers: [
    ...persistenceProviders,
    ...useCaseProviders,
    ...controllerProviders
  ],
})
export class ProdutoModule { }