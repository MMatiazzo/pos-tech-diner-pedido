import { Module } from "@nestjs/common";
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { CadastrarProdutoUseCase } from "src/core/produto/usecase/cadastrar-produto.use-case";
import { IProdutoRepository } from "src/infrastructure/persistence/repositories/produto/Iproduto.repository";
import { ProdutoControllerRoute } from "../api/http-rest/routes/produto.routes";
import { CadastrarProdutoController } from "../operation/controllers/produto/cadastrar-produto.controller";
import { ProdutoGateway } from "../operation/gateways/produto/produto.gateway";

import { PrismaService } from "src/infrastructure/persistence/prisma/prisma.service";
import { ProdutoMongoDbRepository } from "src/infrastructure/persistence/repositories/produto/produto-mongodb.repository";

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
  }
]

const controllerProviders: Provider[] = [
  {
    provide: CadastrarProdutoController,
    useFactory: (cadastrarProdutoUseCase: CadastrarProdutoUseCase) => new CadastrarProdutoController(cadastrarProdutoUseCase),
    inject: [CadastrarProdutoUseCase]
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