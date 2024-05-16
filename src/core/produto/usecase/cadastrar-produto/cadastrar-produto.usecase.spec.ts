import { Test, TestingModule } from '@nestjs/testing';
import { CadastrarProdutoUseCase } from './cadastrar-produto.usecase';
import { IProdutoGateway } from '../../../../application/operation/gateways/produto/Iproduto.gateway';
import { ProdutoDto } from '../../dto/cria-produto.dto';
import { Produto } from '../../entity/produto.entity';
import { BadRequestException } from '@nestjs/common';

describe('CadastrarProdutoUseCase', () => {
  let useCase: CadastrarProdutoUseCase;
  let produtoGateway: IProdutoGateway;

  beforeEach(async () => {
    const produtoGatewayMock: Partial<IProdutoGateway> = {
      cadastrarProduto: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CadastrarProdutoUseCase,
        { provide: IProdutoGateway, useValue: produtoGatewayMock },
      ],
    }).compile();

    useCase = module.get<CadastrarProdutoUseCase>(CadastrarProdutoUseCase);
    produtoGateway = module.get<IProdutoGateway>(IProdutoGateway);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('Deve gerar execao caso os dados estejam faltantes', async () => {
      const payload: ProdutoDto = { nome: '', preco: 0, categoria: '', descricao: '', imagens: [] };
      await expect(useCase.execute(payload)).rejects.toThrow(BadRequestException);
    });

    it('Deve ser capaz de criar um produto', async () => {
      const payload: ProdutoDto = { nome: 'Product', preco: 10, categoria: 'Category', descricao: '', imagens: [] };
      const produto = Produto.new(payload);
      jest.spyOn(Produto, 'new').mockReturnValueOnce(produto);
      await useCase.execute(payload);
      expect(produtoGateway.cadastrarProduto).toHaveBeenCalledWith(produto);
    });

    it('Deve retornar o produto criado', async () => {
      const payload: ProdutoDto = { nome: 'Product', preco: 10, categoria: 'Category', descricao: '', imagens: [] };
      const produto = Produto.new(payload);
      jest.spyOn(Produto, 'new').mockReturnValueOnce(produto);
      jest.spyOn(produtoGateway, 'cadastrarProduto').mockResolvedValueOnce(produto);
      const result = await useCase.execute(payload);
      expect(result).toEqual(produto);
    });
  });
});
