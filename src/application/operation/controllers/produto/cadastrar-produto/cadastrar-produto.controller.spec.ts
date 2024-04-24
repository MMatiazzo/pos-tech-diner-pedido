import { CadastrarProdutoUseCase } from "../../../../../core/produto/usecase/cadastrar-produto/cadastrar-produto.usecase";
import { CadastrarProdutoController } from "./cadastrar-produto.controller";
import { Produto } from "../../../../../core/produto/entity/produto.entity";
import { ProdutoDto } from "src/core/produto/dto/cria-produto.dto";
import { BadRequestException } from "@nestjs/common";
import { IProdutoGateway } from "../../../gateways/produto/Iproduto.gateway";

const ID_UUID = "0";
const produtoDto: ProdutoDto = {
  "nome": "teste",
  "categoria": "Lanche",
  "preco": 10,
  "descricao": "Lanche para todos",
  "imagens": []
}

describe('Cadastrar Produto Controller Test Suites', () => {
  let cadastrarProdutoController: CadastrarProdutoController;
  let cadastrarProdutoUseCase: CadastrarProdutoUseCase;
  let produtoGatewayMock: IProdutoGateway;

  beforeEach(() => {
    produtoGatewayMock = {
      cadastrarProduto: jest.fn(async () => {
        return { ...produtoDto, id: ID_UUID }
      }),
      listarProduto: jest.fn()
    } as IProdutoGateway;

    cadastrarProdutoUseCase = new CadastrarProdutoUseCase(produtoGatewayMock);
    cadastrarProdutoController = new CadastrarProdutoController(cadastrarProdutoUseCase);
  });

  it('Deve ser capaz de criar um novo produto', async () => {
    //Arrange
    const produtoCriado = await cadastrarProdutoController.handle(produtoDto);

    // Assert
    expect(produtoCriado?.id).toEqual(ID_UUID);
    expect(produtoGatewayMock.cadastrarProduto).toHaveBeenNthCalledWith(1, produtoDto);
  });

  it('Não deve ser capaz de cadastrar um produto sem nome', async () => {
    //Arrange
    let error: Error | undefined;
    try {
      const mockProduto = Produto.new({ ...produtoDto, nome: "" }); // Create a mock Produto object if necessary
      await cadastrarProdutoUseCase.execute(mockProduto);
    } catch (err) {
      error = err;
    }

    // Assert
    expect(error).toBeInstanceOf(BadRequestException);
    expect(error?.message).toBe("Produto não contém todas os atributos necessários");
  });

  it('Não deve ser capaz de cadastrar um produto com preço menor ou igual a zero', async () => {
    //Arrange
    const PRECO_INVALIDO = 0;
    let error: Error | undefined;
    try {
      await cadastrarProdutoController.handle({ ...produtoDto, preco: PRECO_INVALIDO });
    } catch (err) {
      error = err;
    }

    // Assert
    expect(error).toBeInstanceOf(BadRequestException);
    expect(error?.message).toBe("Produto não contém todas os atributos necessários");
  });

});
