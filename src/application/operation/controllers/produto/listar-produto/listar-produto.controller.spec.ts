import { Test, TestingModule } from '@nestjs/testing';
import { ListarProdutoController } from './listar-produto.controller';
import { ListarProdutoUseCase } from '../../../../../core/produto/usecase/listar-produto/listrar-produto.usecase';
import { ListarProdutoDto } from '../../../../../core/produto/dto/listar-produto.dto';
import { Produto } from '../../../../../core/produto/entity/produto.entity';

describe('ListarProdutoController', () => {
  let controller: ListarProdutoController;
  let useCase: ListarProdutoUseCase;

  beforeEach(async () => {
    const useCaseMock: Partial<ListarProdutoUseCase> = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListarProdutoController],
      providers: [{ provide: ListarProdutoUseCase, useValue: useCaseMock }],
    }).compile();

    controller = module.get<ListarProdutoController>(ListarProdutoController);
    useCase = module.get<ListarProdutoUseCase>(ListarProdutoUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handle', () => {
    it('should call ListarProdutoUseCase execute method with correct payload', async () => {
      const payload: ListarProdutoDto = { categoria: 'Category' };
      const produtos: Produto[] = [
        {
          id: '66464c90b08dce54855a3c7d',
          categoria: 'Category',
          descricao: '',
          imagens: [],
          nome: 'Product',
          preco: 10,

        },
        {
          id: '66464c987689ae49c5a342fd',
          categoria: 'Category',
          descricao: '',
          imagens: [],
          nome: 'Product',
          preco: 10,
        }
      ]; // sample produtos
      jest.spyOn(useCase, 'execute').mockResolvedValueOnce(produtos);
      await controller.handle(payload);
      expect(useCase.execute).toHaveBeenCalledWith(payload);
    });

    it('should return the result from ListarProdutoUseCase execute method', async () => {
      const payload: ListarProdutoDto = { categoria: 'Category' };
      const produtos: Produto[] = [
        {
          id: '66464c90b08dce54855a3c7d',
          categoria: 'Category',
          descricao: '',
          imagens: [],
          nome: 'Product',
          preco: 10,

        },
        {
          id: '66464c987689ae49c5a342fd',
          categoria: 'Category',
          descricao: '',
          imagens: [],
          nome: 'Product',
          preco: 10,
        }
      ]; // sample produtos
      jest.spyOn(useCase, 'execute').mockResolvedValueOnce(produtos);
      const result = await controller.handle(payload);
      expect(result).toEqual(produtos);
    });
  });
});
