import { Test, TestingModule } from '@nestjs/testing';
import { EditarProdutoController } from './editar-produto.controller';
import { EditarProdutoUseCase } from '../../../../../core/produto/usecase/editar-produto/editar-produto.usecase';
import { EditarProdutoDto } from '../../../../../core/produto/dto/editar-produto.dto';

describe('EditarProdutoController', () => {
  let controller: EditarProdutoController;
  let useCase: EditarProdutoUseCase;

  beforeEach(async () => {
    const useCaseMock: Partial<EditarProdutoUseCase> = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EditarProdutoController],
      providers: [{ provide: EditarProdutoUseCase, useValue: useCaseMock }],
    }).compile();

    controller = module.get<EditarProdutoController>(EditarProdutoController);
    useCase = module.get<EditarProdutoUseCase>(EditarProdutoUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handle', () => {
    it('should call EditarProdutoUseCase execute method with correct payload', async () => {
      const payload: EditarProdutoDto = { id: 'some-id', campo: 'nome', valor: 'New Name' };
      jest.spyOn(useCase, 'execute').mockResolvedValueOnce();
      await controller.handle(payload);
      expect(useCase.execute).toHaveBeenCalledWith(payload);
    });
  });
});
