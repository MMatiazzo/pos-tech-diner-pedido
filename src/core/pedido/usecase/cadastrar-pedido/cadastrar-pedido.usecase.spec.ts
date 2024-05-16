import { Test, TestingModule } from '@nestjs/testing';
import { CadastrarPedidoUseCase } from './cadastrar-pedido.usecase';
import { IProdutoGateway } from '../../../../application/operation/gateways/produto/Iproduto.gateway';
import { IPedidoGateway } from '../../../../application/operation/gateways/pedido/Ipedido.gateway';
import { IQueueGateway } from '../../../../application/operation/gateways/queue/Iqueue.gateway';
import { CriaPedidoDto } from '../../dto/cria-pedido.dto';
import { Pedido } from '../../entity/pedido.entity';
import { CardinalDirections } from '../../entity/pedido.entity';
import fetch from 'node-fetch';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CadastrarPedidoUseCase', () => {
  let useCase: CadastrarPedidoUseCase;
  let produtoGateway: IProdutoGateway;
  let pedidoGateway: IPedidoGateway;
  let queueGateway: IQueueGateway;

  beforeEach(async () => {
    const produtoGatewayMock: Partial<IProdutoGateway> = {
      listarProduto: jest.fn(),
    };

    const pedidoGatewayMock: Partial<IPedidoGateway> = {
      cadastrarPedido: jest.fn(),
    };

    const queueGatewayMock: Partial<IQueueGateway> = {
      enviarMensagem: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CadastrarPedidoUseCase,
        { provide: IProdutoGateway, useValue: produtoGatewayMock },
        { provide: IPedidoGateway, useValue: pedidoGatewayMock },
        { provide: IQueueGateway, useValue: queueGatewayMock },
      ],
    }).compile();

    useCase = module.get<CadastrarPedidoUseCase>(CadastrarPedidoUseCase);
    produtoGateway = module.get<IProdutoGateway>(IProdutoGateway);
    pedidoGateway = module.get<IPedidoGateway>(IPedidoGateway);
    queueGateway = module.get<IQueueGateway>(IQueueGateway);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should throw BadRequestException if produtosIds array is empty', async () => {
      const dto: CriaPedidoDto = { produtosIds: [] };
      const authorization = 'Bearer token';
      await expect(useCase.execute(dto, authorization)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if any produto is not found', async () => {
      const dto: CriaPedidoDto = { produtosIds: ['prodId1', 'prodId2'] };
      const authorization = 'Bearer token';
      jest.spyOn(produtoGateway, 'listarProduto').mockResolvedValueOnce([]);
      await expect(useCase.execute(dto, authorization)).rejects.toThrow(NotFoundException);
    });

    it('should call pedidoGateway.cadastrarPedido with correct pedido data', async () => {
      const dto: CriaPedidoDto = { produtosIds: ['prodId1', 'prodId2'] };
      const authorization = 'Bearer token';
      const clienteResponseJson = { nome: 'Client', email: 'client@example.com' };
      jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(clienteResponseJson),
      } as any);
      jest.spyOn(produtoGateway, 'listarProduto').mockResolvedValueOnce(
        [
          {
            id: '1',
            categoria: 'lanche',
            descricao: '',
            imagens: [],
            nome: 'prod1',
            preco: 10,

          },
          {
            id: '2',
            categoria: 'lanche',
            descricao: '',
            imagens: [],
            nome: 'prod2',
            preco: 10,
          }
        ]);
      const pedido: Pedido = { produtosIds: dto.produtosIds, status: CardinalDirections.AGUARDANDO_PAGAMENTO };
      jest.spyOn(Pedido, 'new').mockReturnValueOnce(pedido);
      const clienteId = clienteResponseJson.email;
      const pedidoCadastrado: Pedido = { ...pedido, clienteId };
      jest.spyOn(pedidoGateway, 'cadastrarPedido').mockResolvedValueOnce(pedidoCadastrado);
      await useCase.execute(dto, authorization);
      expect(pedidoGateway.cadastrarPedido).toHaveBeenCalledWith(expect.objectContaining({ ...pedido, clienteId }));
    });

    it('should call queueGateway.enviarMensagem with correct parameters', async () => {
      const dto: CriaPedidoDto = { produtosIds: ['prodId1', 'prodId2'] };
      const authorization = 'Bearer token';
      const clienteResponseJson = { nome: 'Client', email: 'client@example.com' };
      jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(clienteResponseJson),
      } as any);
      jest.spyOn(produtoGateway, 'listarProduto').mockResolvedValueOnce(
        [
          {
            id: '1',
            categoria: 'lanche',
            descricao: '',
            imagens: [],
            nome: 'prod1',
            preco: 10,

          },
          {
            id: '2',
            categoria: 'lanche',
            descricao: '',
            imagens: [],
            nome: 'prod2',
            preco: 10,
          }
        ]
      );
      const pedido: Pedido = { produtosIds: dto.produtosIds, status: CardinalDirections.AGUARDANDO_PAGAMENTO };
      jest.spyOn(Pedido, 'new').mockReturnValueOnce(pedido);
      jest.spyOn(pedidoGateway, 'cadastrarPedido').mockResolvedValueOnce(pedido);
      await useCase.execute(dto, authorization);
      expect(queueGateway.enviarMensagem).toHaveBeenCalledWith(process.env.SQS_CRIAR_PAGAMENTO_QUEUE, pedido);
    });
  });
});
