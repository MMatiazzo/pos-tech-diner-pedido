import { Module } from "@nestjs/common";
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { IProdutoRepository } from "src/infrastructure/persistence/repositories/produto/Iproduto.repository";
import { ProdutoControllerRoute } from "../api/http-rest/routes/produto.routes";
import { CadastrarProdutoController } from "../operation/controllers/produto/cadastrar-produto/cadastrar-produto.controller";
import { ProdutoGateway } from "../operation/gateways/produto/produto.gateway";

import { MongooseModule, getModelToken } from "@nestjs/mongoose";
import { CadastrarProdutoUseCase } from "src/core/produto/usecase/cadastrar-produto/cadastrar-produto.usecase";
import { DeletarProdutoUseCase } from "src/core/produto/usecase/deletar-produto/deletar-produto.usecase";
import { EditarProdutoUseCase } from "src/core/produto/usecase/editar-produto/editar-produto.usecase";
import { ListarProdutoUseCase } from "src/core/produto/usecase/listar-produto/listrar-produto.usecase";
import { ProdutoModel, ProdutoSchema } from "src/infrastructure/persistence/mongoose/schemas/produto/produto.schema";
import { ProdutoMongodbMongooseRepository } from "src/infrastructure/persistence/repositories/produto/produto-mongodb-mongoose.repository";
import { DeletarProdutoController } from "../operation/controllers/produto/deletar-produto/deletar-produto.controller";
import { EditarProdutoController } from "../operation/controllers/produto/editar-produto/editar-produto.controller";
import { ListarProdutoController } from "../operation/controllers/produto/listar-produto/listar-produto.controller";
import { IProdutoGateway } from "../operation/gateways/produto/Iproduto.gateway";

const persistenceProviders: Provider[] = [
  {
    provide: IProdutoRepository,
    useFactory: (produtoModel) => new ProdutoMongodbMongooseRepository(produtoModel),
    inject: [getModelToken('produtos')]
  },
  {
    provide: IProdutoGateway,
    useFactory: (produtoRepository: IProdutoRepository) => new ProdutoGateway(produtoRepository),
    inject: [IProdutoRepository]
  }
]

const useCaseProviders: Provider[] = [
  {
    provide: CadastrarProdutoUseCase,
    useFactory: (produtoGateway: ProdutoGateway) => new CadastrarProdutoUseCase(produtoGateway),
    inject: [IProdutoGateway]
  },
  {
    provide: ListarProdutoUseCase,
    useFactory: (produtoGateway: ProdutoGateway) => new ListarProdutoUseCase(produtoGateway),
    inject: [IProdutoGateway]
  },
  {
    provide: EditarProdutoUseCase,
    useFactory: (produtoGateway: ProdutoGateway) => new EditarProdutoUseCase(produtoGateway),
    inject: [IProdutoGateway]
  },
  {
    provide: DeletarProdutoUseCase,
    useFactory: (produtoGateway: ProdutoGateway) => new DeletarProdutoUseCase(produtoGateway),
    inject: [IProdutoGateway]
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
  imports: [
    MongooseModule.forFeature([{ name: 'produtos', schema: ProdutoSchema }]),
  ],
  controllers: [ProdutoControllerRoute],
  providers: [
    ...persistenceProviders,
    ...useCaseProviders,
    ...controllerProviders
  ],
})
export class ProdutoModule { }