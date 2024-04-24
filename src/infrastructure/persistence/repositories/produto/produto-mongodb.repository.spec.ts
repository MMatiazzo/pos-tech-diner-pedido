import { ProdutoDto } from 'src/core/produto/dto/cria-produto.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { IProdutoRepository } from './Iproduto.repository';

const produtoDto: ProdutoDto = {
  "nome": "novo produto",
  "categoria": "Bebida",
  "preco": 5,
  "descricao": "Bebida leve e deliciosa",
  "imagens": []
};

const ID_UUID_MOCK = "0";
let bancoMock = [];

class MockProdutoRepository implements IProdutoRepository {
  cadastrar: jest.Mock<any, any>;
  editar: jest.Mock<any, any>;
  listar: jest.Mock<any, any>;
  remover: jest.Mock<any, any>;

  constructor(prismaService: PrismaService) {
    this.cadastrar = jest.fn(async (produto: ProdutoDto) => {
      const produtoCriado = { ...produto, id: ID_UUID_MOCK };
      bancoMock.push(produtoCriado);
      return produtoCriado;
    });

    this.editar = jest.fn();
    this.listar = jest.fn(async () => {
      return bancoMock;
    });
    this.remover = jest.fn();
  }
}

describe('Produto Repository Test Suite', () => {
  let prismaService: PrismaService;
  let produtoRepository: MockProdutoRepository;

  beforeEach(() => {
    bancoMock = [
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
    produtoRepository = new MockProdutoRepository(prismaService);
  });

  it('Deve ser capaz de cadastrar um produto', async () => {
    // Act
    const result = await produtoRepository.cadastrar(produtoDto);

    // Assert
    expect(result).toHaveProperty("id");
    expect(produtoRepository.cadastrar).toHaveBeenNthCalledWith(1, produtoDto);
  });
});
