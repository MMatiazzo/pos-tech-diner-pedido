import { Test, TestingModule } from '@nestjs/testing';
import { CadastrarPedidoController } from './cadastrar-pedido.controller';
import { CadastrarPedidoUseCase } from '../../../../../core/pedido/usecase/cadastrar-pedido/cadastrar-pedido.usecase';
import { CriaPedidoDto } from '../../../../../core/pedido/dto/cria-pedido.dto';

describe('CadastrarPedidoController', () => {
  let controller: CadastrarPedidoController;
  let useCase: CadastrarPedidoUseCase;

  beforeEach(async () => {
    const useCaseMock: Partial<CadastrarPedidoUseCase> = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CadastrarPedidoController],
      providers: [{ provide: CadastrarPedidoUseCase, useValue: useCaseMock }],
    }).compile();

    controller = module.get<CadastrarPedidoController>(CadastrarPedidoController);
    useCase = module.get<CadastrarPedidoUseCase>(CadastrarPedidoUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handle', () => {
    it('Deve chamar CadastrarPedidoUseCase com o payload correto', async () => {
      const payload: CriaPedidoDto = { produtosIds: [] };
      const authorization = 'Bearer some-token';
      jest.spyOn(useCase, 'execute').mockResolvedValueOnce();
      await controller.handle(payload, authorization);
      expect(useCase.execute).toHaveBeenCalledWith(payload, authorization);
    });
  });
});
