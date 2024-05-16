import { Test, TestingModule } from '@nestjs/testing';
import { EditarPedidoStatusUseCase } from './editar-pedido-status.usecase';
import { IPedidoGateway } from '../../../../application/operation/gateways/pedido/Ipedido.gateway';
import { IProdutoGateway } from '../../../../application/operation/gateways/produto/Iproduto.gateway';
import { IQueueGateway } from '../../../../application/operation/gateways/queue/Iqueue.gateway';
import { EditarPedidoDto } from '../../dto/editar-pedido.dto';
import { Pedido } from '../../entity/pedido.entity';
import { CardinalDirections } from '../../entity/pedido.entity';

const id = '123';
const status = CardinalDirections.PAGAMENTO_CONFIRMADO as string;

describe('EditarPedidoStatusUseCase', () => {
  let useCase: EditarPedidoStatusUseCase;
  let pedidoGateway: IPedidoGateway;
  let produtoGateway: IProdutoGateway;
  let queueGateway: IQueueGateway;

  beforeEach(async () => {
    const pedidoGatewayMock: Partial<IPedidoGateway> = {
      editarStatusPedido: jest.fn(async () => {
        return {
          id,
          status,
          produtosIds: [],
        }
      }),
    };

    const produtoGatewayMock: Partial<IProdutoGateway> = {
      listarProduto: jest.fn(),
    };

    const queueGatewayMock: Partial<IQueueGateway> = {
      enviarMensagem: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EditarPedidoStatusUseCase,
        { provide: IPedidoGateway, useValue: pedidoGatewayMock },
        { provide: IProdutoGateway, useValue: produtoGatewayMock },
        { provide: IQueueGateway, useValue: queueGatewayMock },
      ],
    }).compile();

    useCase = module.get<EditarPedidoStatusUseCase>(EditarPedidoStatusUseCase);
    pedidoGateway = module.get<IPedidoGateway>(IPedidoGateway);
    produtoGateway = module.get<IProdutoGateway>(IProdutoGateway);
    queueGateway = module.get<IQueueGateway>(IQueueGateway);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('Deve chamar o pedido gateway com os parametros corretos', async () => {
      const dto: EditarPedidoDto = { id: '123', status: CardinalDirections.PAGAMENTO_CONFIRMADO };
      await useCase.execute(dto);
      expect(pedidoGateway.editarStatusPedido).toHaveBeenCalledWith(id, status);
    });

    it('Deve ser capaz de modificar corretamente o pedido', async () => {
      const pedidoModificado: Pedido = { id, produtosIds: ['prodId1', 'prodId2'], status: 'teste' };
      const dto: EditarPedidoDto = { id, status };
      jest.spyOn(pedidoGateway, 'editarStatusPedido').mockResolvedValueOnce(pedidoModificado);
      await useCase.execute(dto);
      expect(produtoGateway.listarProduto).toHaveBeenCalledWith({ ids: pedidoModificado.produtosIds.join(',') });
    });
  });
});
