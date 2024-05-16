import { Test, TestingModule } from '@nestjs/testing';
import { EditarPedidoStatusController } from './editar-pedido-status.controller';
import { EditarPedidoStatusUseCase } from '../../../../../core/pedido/usecase/editar-status-pedido/editar-pedido-status.usecase';
import { EditarPedidoDto } from '../../../../../core/pedido/dto/editar-pedido.dto';

describe('EditarPedidoStatusController', () => {
  let controller: EditarPedidoStatusController;
  let useCase: EditarPedidoStatusUseCase;

  beforeEach(async () => {
    const useCaseMock: Partial<EditarPedidoStatusUseCase> = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EditarPedidoStatusController],
      providers: [{ provide: EditarPedidoStatusUseCase, useValue: useCaseMock }],
    }).compile();

    controller = module.get<EditarPedidoStatusController>(EditarPedidoStatusController);
    useCase = module.get<EditarPedidoStatusUseCase>(EditarPedidoStatusUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handle', () => {
    it('Deve chamar EditarPedidoStatusUseCase com o payload correto', async () => {
      const payload: EditarPedidoDto = { id: 'some-id', status: 'completed' };
      jest.spyOn(useCase, 'execute').mockResolvedValueOnce();
      await controller.handle(payload);
      expect(useCase.execute).toHaveBeenCalledWith(payload);
    });
  });
});
