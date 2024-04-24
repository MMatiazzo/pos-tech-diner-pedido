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
import { EditarProdutoUseCase } from "src/core/produto/usecase/editar-produto/editar-produto.usecase";
import { EditarProdutoController } from "../operation/controllers/produto/editar-produto/editar-produto.controller";
import { DeletarProdutoUseCase } from "src/core/produto/usecase/deletar-produto/deletar-produto.usecase";
import { DeletarProdutoController } from "../operation/controllers/produto/deletar-produto/deletar-produto.controller";

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
  },
  {
    provide: EditarProdutoUseCase,
    useFactory: (produtoGateway: ProdutoGateway) => new EditarProdutoUseCase(produtoGateway),
    inject: [ProdutoGateway]
  },
  {
    provide: DeletarProdutoUseCase,
    useFactory: (produtoGateway: ProdutoGateway) => new DeletarProdutoUseCase(produtoGateway),
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
  },
  {
    provide: EditarProdutoController,
    useFactory: (editarProdutoUseCase: EditarProdutoUseCase) => new EditarProdutoController(editarProdutoUseCase),
    inject: [EditarProdutoUseCase]
  },
  {
    provide: DeletarProdutoController,
    useFactory: (deletarProdutoUseCase: DeletarProdutoUseCase) => new DeletarProdutoController(deletarProdutoUseCase),
    inject: [DeletarProdutoUseCase]
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