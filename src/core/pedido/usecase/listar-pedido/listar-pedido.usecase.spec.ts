import { Test, TestingModule } from '@nestjs/testing';
import { ListarPedidoUseCase } from './listar-pedido.usecase';
import { IPedidoGateway } from '../../../../application/operation/gateways/pedido/Ipedido.gateway';
import { ListarPedidoDto } from '../../dto/listar-pedido.dto';
import { Pedido } from '../../entity/pedido.entity';

describe('ListarPedidoUseCase', () => {
  let useCase: ListarPedidoUseCase;
  let pedidoGateway: IPedidoGateway;

  beforeEach(async () => {
    const pedidoGatewayMock: Partial<IPedidoGateway> = {
      listarPedido: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListarPedidoUseCase,
        { provide: IPedidoGateway, useValue: pedidoGatewayMock },
      ],
    }).compile();

    useCase = module.get<ListarPedidoUseCase>(ListarPedidoUseCase);
    pedidoGateway = module.get<IPedidoGateway>(IPedidoGateway);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should call pedidoGateway.listarPedido with correct ids', async () => {
      const ids: string[] = ['id1', 'id2', 'id3'];
      const dto: ListarPedidoDto = { ids };
      await useCase.execute(dto);
      expect(pedidoGateway.listarPedido).toHaveBeenCalledWith({ ids });
    });

    it('should return the list of pedidos', async () => {
      const ids: string[] = ['id1', 'id2', 'id3'];
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
      const dto: ListarPedidoDto = { ids };
      jest.spyOn(pedidoGateway, 'listarPedido').mockResolvedValueOnce(pedidos);
      const result = await useCase.execute(dto);
      expect(result).toEqual(pedidos);
    });
  });
});
