import { Test, TestingModule } from '@nestjs/testing';
import { ListarPedidoController } from './listar-pedido.controller';
import { ListarPedidoUseCase } from '../../../../../core/pedido/usecase/listar-pedido/listar-pedido.usecase';
import { ListarPedidoDto } from '../../../../../core/pedido/dto/listar-pedido.dto';
import { Pedido } from '../../../../../core/pedido/entity/pedido.entity';

describe('ListarPedidoController', () => {
  let controller: ListarPedidoController;
  let useCase: ListarPedidoUseCase;

  beforeEach(async () => {
    const useCaseMock: Partial<ListarPedidoUseCase> = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListarPedidoController],
      providers: [{ provide: ListarPedidoUseCase, useValue: useCaseMock }],
    }).compile();

    controller = module.get<ListarPedidoController>(ListarPedidoController);
    useCase = module.get<ListarPedidoUseCase>(ListarPedidoUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handle', () => {
    it('should call ListarPedidoUseCase execute method with correct payload', async () => {
      const payload: ListarPedidoDto = { ids: ['id1', 'id2'] };
      jest.spyOn(useCase, 'execute').mockResolvedValueOnce([]);
      await controller.handle(payload);
      expect(useCase.execute).toHaveBeenCalledWith(payload);
    });

    it('should return the result from ListarPedidoUseCase execute method', async () => {
      const payload: ListarPedidoDto = { ids: ['id1', 'id2'] };
      const pedidos: Pedido[] = [
        {
          produtosIds: [],
          status: 'Recebido',
        },
        {
          produtosIds: [],
          status: 'Recebido',
        },
        {
          produtosIds: [],
          status: 'Recebido',
        },
      ]; // sample pedidos
      jest.spyOn(useCase, 'execute').mockResolvedValueOnce(pedidos);
      const result = await controller.handle(payload);
      expect(result).toEqual(pedidos);
    });
  });
});
