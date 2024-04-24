import { IProdutoGateway } from '../../../../application/operation/gateways/produto/Iproduto.gateway';
import { ListarProdutoDto } from '../../dto/listar-produto.dto';
import { ListarProdutoUseCase } from './listrar-produto.usecase';

const listarProdutosDto: ListarProdutoDto = {
  categoria: "Lanche",
  nome: "produto 1",
}

const bancoMock = [
  {
    "nome": "produto 1",
    "categoria": "Lanche",
    "preco": 10,
    "descricao": "Lanche para todos",
    "imagens": []
  },
  {
    "nome": "produto 2",
    "categoria": "Sobresa",
    "preco": 5,
    "descricao": "Sobremesa para todos",
    "imagens": []
  },
]

describe('Listar Produto Use Case', () => {
  let listarProdutoUseCase: ListarProdutoUseCase;
  let produtoGatewayMock: IProdutoGateway;

  beforeEach(() => {
    produtoGatewayMock = {
      cadastrarProduto: jest.fn(),
      listarProduto: jest.fn(async (array) => {
        if (array?.categoria && array?.nome)
          return bancoMock.filter(bm =>
            bm.categoria === array.categoria &&
            bm.nome === array.nome
          )

        if (array?.categoria)
          return bancoMock.filter(bm =>
            bm.categoria === array.categoria
          )

        if (array?.nome)
          return bancoMock.filter(bm =>
            bm.nome === array.nome
          )

        return bancoMock;
      }),
    } as IProdutoGateway;

    listarProdutoUseCase = new ListarProdutoUseCase(produtoGatewayMock);
  });

  it('Deve ser capaz de listar todos os produtos', async () => {
    //Arrange

    // Act
    const result = await listarProdutoUseCase.execute(listarProdutosDto);

    // Assert
    expect(result.length).toEqual(1);
    expect(result[0]?.nome).toEqual("produto 1");
    expect(produtoGatewayMock.listarProduto).toHaveBeenNthCalledWith(1, listarProdutosDto);
  });

  it('Deve listar todos os dados caso não seja passado parâmetros de filtro', async () => {
    //Arrange
    // Act
    const result = await listarProdutoUseCase.execute({});

    // Assert
    expect(result.length).toEqual(2);
    expect(result[1]?.nome).toEqual("produto 2");
    expect(produtoGatewayMock.listarProduto).toHaveBeenNthCalledWith(1, {});
  });
});
