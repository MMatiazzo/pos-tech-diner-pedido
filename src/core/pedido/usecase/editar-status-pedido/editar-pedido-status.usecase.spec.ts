import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { EditarPedidoStatusUseCase } from './editar-pedido-status.usecase';
import { IPedidoGateway } from '../../../../application/operation/gateways/pedido/Ipedido.gateway';
import { IProdutoGateway } from '../../../../application/operation/gateways/produto/Iproduto.gateway';
import { IQueueGateway } from '../../../../application/operation/gateways/queue/Iqueue.gateway';
import { Connection, ClientSession } from 'mongoose';
import { EditarPedidoDto } from '../../dto/editar-pedido.dto';
import { CardinalDirections } from '../../entity/pedido.entity';
import { getConnectionToken } from '@nestjs/mongoose';

describe('EditarPedidoStatusUseCase', () => {
  let useCase: EditarPedidoStatusUseCase;
  let pedidoGateway: IPedidoGateway;
  let produtoGateway: IProdutoGateway;
  let queueGateway: IQueueGateway;
  let connection: Connection;
  let session: ClientSession;

  beforeEach(async () => {
    session = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    } as unknown as ClientSession;

    const mockConnection = {
      startSession: jest.fn().mockResolvedValue(session),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EditarPedidoStatusUseCase,
        {
          provide: IPedidoGateway,
          useValue: {
            editarStatusPedido: jest.fn(),
          },
        },
        {
          provide: IProdutoGateway,
          useValue: {
            listarProduto: jest.fn(),
          },
        },
        {
          provide: IQueueGateway,
          useValue: {
            enviarMensagem: jest.fn(),
          },
        },
        {
          provide: getConnectionToken(),
          useValue: mockConnection,
        },
      ],
    }).compile();

    useCase = module.get<EditarPedidoStatusUseCase>(EditarPedidoStatusUseCase);
    pedidoGateway = module.get<IPedidoGateway>(IPedidoGateway);
    produtoGateway = module.get<IProdutoGateway>(IProdutoGateway);
    queueGateway = module.get<IQueueGateway>(IQueueGateway);
    connection = module.get<Connection>(getConnectionToken());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('deve lançar BadRequestException se ocorrer um erro durante a edição do pedido', async () => {
    (pedidoGateway.editarStatusPedido as jest.Mock).mockRejectedValue(new Error('Erro ao editar pedido'));

    await expect(
      useCase.execute({ id: 'invalidId', status: 'someStatus' } as EditarPedidoDto),
    ).rejects.toThrow(new BadRequestException('Erro ao editar pedido'));

    expect(session.abortTransaction).toHaveBeenCalled();
  });

  it('deve editar o status do pedido com sucesso e enviar mensagem para a fila quando o status for PAGAMENTO_CONFIRMADO', async () => {
    (pedidoGateway.editarStatusPedido as jest.Mock).mockResolvedValue({
      id: 'validId',
      status: 'PAGAMENTO_CONFIRMADO',
      clienteId: 'clienteId',
      produtosIds: ['produtoId1', 'produtoId2']
    });
    (produtoGateway.listarProduto as jest.Mock).mockResolvedValue([{ id: 'produtoId1' }, { id: 'produtoId2' }]);

    await expect(
      useCase.execute({ id: 'validId', status: CardinalDirections.PAGAMENTO_CONFIRMADO } as EditarPedidoDto),
    ).resolves.not.toThrow();

    expect(pedidoGateway.editarStatusPedido).toHaveBeenCalled();
    expect(produtoGateway.listarProduto).toHaveBeenCalled();
    expect(queueGateway.enviarMensagem).toHaveBeenCalled();
    expect(session.commitTransaction).toHaveBeenCalled();
  });

  it('deve editar o status do pedido com sucesso e não enviar mensagem para a fila quando o status não for PAGAMENTO_CONFIRMADO', async () => {
    (pedidoGateway.editarStatusPedido as jest.Mock).mockResolvedValue({
      id: 'validId',
      status: 'OUTRO_STATUS',
      clienteId: 'clienteId',
      produtosIds: ['produtoId1', 'produtoId2']
    });
    (produtoGateway.listarProduto as jest.Mock).mockResolvedValue([{ id: 'produtoId1' }, { id: 'produtoId2' }]);

    await expect(
      useCase.execute({ id: 'validId', status: 'OUTRO_STATUS' } as EditarPedidoDto),
    ).resolves.not.toThrow();

    expect(pedidoGateway.editarStatusPedido).toHaveBeenCalled();
    expect(produtoGateway.listarProduto).toHaveBeenCalled();
    expect(queueGateway.enviarMensagem).not.toHaveBeenCalled();
    expect(session.commitTransaction).toHaveBeenCalled();
  });
});
