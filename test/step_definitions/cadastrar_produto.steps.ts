import { Given, Then, When } from '@cucumber/cucumber';
import * as assert from 'assert';
import { CadastrarProdutoController } from '../../src/application/operation/controllers/produto/cadastrar-produto/cadastrar-produto.controller';
import { IProdutoGateway } from '../../src/application/operation/gateways/produto/Iproduto.gateway';
import { EditarProdutoDto } from '../../src/core/produto/dto/editar-produto.dto';
import { ListarProdutoDto } from '../../src/core/produto/dto/listar-produto.dto';
import { Produto } from '../../src/core/produto/entity/produto.entity';
import { CadastrarProdutoUseCase } from '../../src/core/produto/usecase/cadastrar-produto/cadastrar-produto.usecase';

let produtoGateway: IProdutoGateway;
let cadastrarProdutoUseCase: CadastrarProdutoUseCase;
let cadastrarProdutoController: CadastrarProdutoController;
let payload: Produto;
let response: any;

Given('A module to create a new product', () => {
  produtoGateway = {
    cadastrarProduto: async (produto: Produto) => {
      return produto;
    },
    listarProduto: async (_listarProdutoDto: ListarProdutoDto) =>
      [] as Produto[],
    editarProduto: async (_editarProdutoDto: EditarProdutoDto) => {},
    deletarProduto: async (_id: string) => null,
  };

  cadastrarProdutoUseCase = new CadastrarProdutoUseCase(produtoGateway);
  cadastrarProdutoController = new CadastrarProdutoController(
    cadastrarProdutoUseCase,
  );
});

When('Call to cadastrarProdutoController', async () => {
  payload = {
    id: '1',
    nome: 'Produto Teste',
    categoria: 'Categoria Teste',
    descricao: 'Descrição Teste',
    imagens: [],
    preco: 10.0,
  };

  response = await cadastrarProdutoController.handle(payload);
});

Then('The response product should be named {string}', (productName: string) => {
  assert.equal(response?.nome, productName);
});
