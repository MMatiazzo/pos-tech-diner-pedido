import { BadRequestException } from '@nestjs/common';
import { IProdutoGateway } from '../../../application/operation/gateways/produto/Iproduto.gateway';
import { ProdutoDto } from '../dto/cria-produto.dto';
import { Produto } from '../entity/produto.entity';
import { CadastrarProdutoUseCase } from './cadastrar-produto.use-case';

const ID_UUID = "0";
const produtoDto: ProdutoDto = {
  "nome": "teste",
  "categoria": "Lanche",
  "preco": 10,
  "descricao": "Lanche para todos",
  "imagens": []
}

describe('CadastrarProdutoUseCase', () => {
  let cadastrarProdutoUseCase: CadastrarProdutoUseCase;
  let produtoGatewayMock: IProdutoGateway;

  beforeEach(() => {
    produtoGatewayMock = {
      cadastrarProduto: jest.fn(async () => {
        return { ...produtoDto, id: ID_UUID }
      }),
    } as IProdutoGateway;

    cadastrarProdutoUseCase = new CadastrarProdutoUseCase(produtoGatewayMock);
  });

  it('Deve ser capaz de criar um novo produto', async () => {
    //Arrange
    const mockProduto = Produto.new(produtoDto); // Create a mock Produto object if necessary

    // Act
    const result = await cadastrarProdutoUseCase.execute(produtoDto);

    // Assert
    expect(result.id).toEqual(ID_UUID);
    expect(produtoGatewayMock.cadastrarProduto).toHaveBeenNthCalledWith(1, mockProduto);
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
      const mockProduto = Produto.new({ ...produtoDto, preco: PRECO_INVALIDO }); // Create a mock Produto object if necessary
      await cadastrarProdutoUseCase.execute(mockProduto);
    } catch (err) {
      error = err;
    }

    // Assert
    expect(error).toBeInstanceOf(BadRequestException);
    expect(error?.message).toBe("Produto não contém todas os atributos necessários");
  });
});
