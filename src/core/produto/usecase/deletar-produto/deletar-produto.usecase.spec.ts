import { Test, TestingModule } from '@nestjs/testing';
import { DeletarProdutoUseCase } from './deletar-produto.usecase';
import { IProdutoGateway } from '../../../../application/operation/gateways/produto/Iproduto.gateway';
import { Produto } from '../../entity/produto.entity';

describe('DeletarProdutoUseCase', () => {
  let useCase: DeletarProdutoUseCase;
  let produtoGateway: IProdutoGateway;

  beforeEach(async () => {
    const produtoGatewayMock: Partial<IProdutoGateway> = {
      deletarProduto: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeletarProdutoUseCase,
        { provide: IProdutoGateway, useValue: produtoGatewayMock },
      ],
    }).compile();

    useCase = module.get<DeletarProdutoUseCase>(DeletarProdutoUseCase);
    produtoGateway = module.get<IProdutoGateway>(IProdutoGateway);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('Deve ser capaz de deletar um produto', async () => {
      const id = 'some-id';
      await useCase.execute(id);
      expect(produtoGateway.deletarProduto).toHaveBeenCalledWith(id);
    });

    it('Deve retornar null se não encontrar um produto pelo id', async () => {
      const id = 'some-id';
      jest.spyOn(produtoGateway, 'deletarProduto').mockResolvedValueOnce(null);
      const result = await useCase.execute(id);
      expect(result).toBeNull();
    });

    it('Deve ser capaz de deletar um produto v2', async () => {
      const id = 'some-id';
      const produto: Produto = {
        categoria: 'categoria',
        descricao: 'descricao',
        imagens: [],
        nome: 'nome',
        preco: 100,
      }; // provide a sample Produto object
      jest.spyOn(produtoGateway, 'deletarProduto').mockResolvedValueOnce(produto);
      const result = await useCase.execute(id);
      expect(result).toEqual(produto);
    });
  });
});
