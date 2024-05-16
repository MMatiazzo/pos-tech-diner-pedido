import { Test, TestingModule } from '@nestjs/testing';
import { CadastrarProdutoController } from './cadastrar-produto.controller';
import { CadastrarProdutoUseCase } from '../../../../../core/produto/usecase/cadastrar-produto/cadastrar-produto.usecase';
import { ProdutoDto } from '../../../../../core/produto/dto/cria-produto.dto';
import { Produto } from '../../../../../core/produto/entity/produto.entity';

describe('CadastrarProdutoController', () => {
  let controller: CadastrarProdutoController;
  let useCase: CadastrarProdutoUseCase;

  beforeEach(async () => {
    const useCaseMock: Partial<CadastrarProdutoUseCase> = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CadastrarProdutoController],
      providers: [{ provide: CadastrarProdutoUseCase, useValue: useCaseMock }],
    }).compile();

    controller = module.get<CadastrarProdutoController>(CadastrarProdutoController);
    useCase = module.get<CadastrarProdutoUseCase>(CadastrarProdutoUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handle', () => {
    it('Deve chamar CadastrarProdutoUseCase com o produto correto', async () => {
      const produto: ProdutoDto = { nome: 'Product', preco: 10, categoria: 'Category', descricao: '', imagens: [] };
      jest.spyOn(useCase, 'execute').mockResolvedValueOnce({} as Produto);
      await controller.handle(produto);
      expect(useCase.execute).toHaveBeenCalledWith(produto);
    });

    it('Deve retornar o resultado do CadastrarProdutoUseCase', async () => {
      const produto: ProdutoDto = { nome: 'Product', preco: 10, categoria: 'Category', descricao: '', imagens: [] };
      const produtoCriado: Produto = { id: 'some-id', ...produto };
      jest.spyOn(useCase, 'execute').mockResolvedValueOnce(produtoCriado);
      const result = await controller.handle(produto);
      expect(result).toEqual(produtoCriado);
    });
  });
});
