import { Test, TestingModule } from '@nestjs/testing';
import { DeletarProdutoController } from './deletar-produto.controller';
import { DeletarProdutoUseCase } from '../../../../../core/produto/usecase/deletar-produto/deletar-produto.usecase';
import { Produto } from '../../../../../core/produto/entity/produto.entity';

describe('DeletarProdutoController', () => {
  let controller: DeletarProdutoController;
  let useCase: DeletarProdutoUseCase;

  beforeEach(async () => {
    const useCaseMock: Partial<DeletarProdutoUseCase> = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeletarProdutoController],
      providers: [{ provide: DeletarProdutoUseCase, useValue: useCaseMock }],
    }).compile();

    controller = module.get<DeletarProdutoController>(DeletarProdutoController);
    useCase = module.get<DeletarProdutoUseCase>(DeletarProdutoUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handle', () => {
    it('Deve chamar DeletarProdutoUseCase com o id correto', async () => {
      const id = 'some-id';
      jest.spyOn(useCase, 'execute').mockResolvedValueOnce(null);
      await controller.handle(id);
      expect(useCase.execute).toHaveBeenCalledWith(id);
    });

    it('Deve retornar o resultado do DeletarProdutoUseCase', async () => {
      const id = 'some-id';
      const deletedProduto: Produto = { id, nome: 'Product', preco: 10, categoria: 'Category', descricao: '', imagens: [] };
      jest.spyOn(useCase, 'execute').mockResolvedValueOnce(deletedProduto);
      const result = await controller.handle(id);
      expect(result).toEqual(deletedProduto);
    });
  });
});
