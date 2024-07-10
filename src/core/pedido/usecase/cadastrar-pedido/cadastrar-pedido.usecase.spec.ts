import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientSession, Connection } from 'mongoose';
import { IPedidoGateway } from '../../../../application/operation/gateways/pedido/Ipedido.gateway';
import { IProdutoGateway } from '../../../../application/operation/gateways/produto/Iproduto.gateway';
import { IQueueGateway } from '../../../../application/operation/gateways/queue/Iqueue.gateway';
import { CriaPedidoDto } from '../../dto/cria-pedido.dto';
import { CadastrarPedidoUseCase } from './cadastrar-pedido.usecase';

describe('CadastrarPedidoUseCase', () => {
  let useCase: CadastrarPedidoUseCase;
  let produtoGateway: IProdutoGateway;
  let pedidoGateway: IPedidoGateway;
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
        CadastrarPedidoUseCase,
        {
          provide: IProdutoGateway,
          useValue: {
            listarProduto: jest.fn(),
          },
        },
        {
          provide: IPedidoGateway,
          useValue: {
            cadastrarPedido: jest.fn(),
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

    useCase = module.get<CadastrarPedidoUseCase>(CadastrarPedidoUseCase);
    produtoGateway = module.get<IProdutoGateway>(IProdutoGateway);
    pedidoGateway = module.get<IPedidoGateway>(IPedidoGateway);
    queueGateway = module.get<IQueueGateway>(IQueueGateway);
    connection = module.get<Connection>(getConnectionToken());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve jogar execao quando nao ter produtos', async () => {
    await expect(
      useCase.execute({ produtosIds: [] } as CriaPedidoDto, 'Bearer token'),
    ).rejects.toThrow(new BadRequestException('Não é possível fazer um pedido sem produtos'));
  });

  it('should throw NotFoundException if any product is not found', async () => {
    (produtoGateway.listarProduto as jest.Mock).mockResolvedValue([]);

    await expect(
      useCase.execute({ produtosIds: ['validId', 'invalidId'] } as CriaPedidoDto, 'Bearer token'),
    ).rejects.toThrow(new NotFoundException('Produto não encontrado'));
  });

  it('deve jogar execao quando não encontrar cliente', async () => {
    (produtoGateway.listarProduto as jest.Mock).mockResolvedValue([{ id: 'validId' }]);
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue({}),
    } as any);

    await expect(
      useCase.execute({ produtosIds: ['validId'] } as CriaPedidoDto, 'Bearer token'),
    ).rejects.toThrow(new BadRequestException('Cliente não encontrado'));
  });

  it('deve criar um pedido', async () => {
    (produtoGateway.listarProduto as jest.Mock).mockResolvedValue([{ id: 'validId' }]);
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue({ nome: 'clientName', email: 'clientEmail' }),
    } as any);
    (pedidoGateway.cadastrarPedido as jest.Mock).mockResolvedValue({ id: 'orderId' });

    await expect(
      useCase.execute({ produtosIds: ['validId'] } as CriaPedidoDto, 'Bearer token'),
    ).resolves.not.toThrow();

    expect(produtoGateway.listarProduto).toHaveBeenCalled();
    expect(pedidoGateway.cadastrarPedido).toHaveBeenCalled();
    expect(queueGateway.enviarMensagem).toHaveBeenCalled();
    expect(session.commitTransaction).toHaveBeenCalled();
  });

  it('deve abortar a transaction', async () => {
    (produtoGateway.listarProduto as jest.Mock).mockResolvedValue([{ id: 'validId' }]);
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue({ nome: 'clientName', email: 'clientEmail' }),
    } as any);
    (pedidoGateway.cadastrarPedido as jest.Mock).mockRejectedValue(new Error('Order creation failed'));

    await expect(
      useCase.execute({ produtosIds: ['validId'] } as CriaPedidoDto, 'Bearer token'),
    ).rejects.toThrow('Order creation failed');

    expect(session.abortTransaction).toHaveBeenCalled();
  });
});
