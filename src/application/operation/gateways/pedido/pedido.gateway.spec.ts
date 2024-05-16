import { Test, TestingModule } from '@nestjs/testing';
import { PedidoGateway } from './pedido.gateway';
import { IPedidoRepository } from '../../../../infrastructure/persistence/repositories/pedido/Ipedido.repository';
import { Pedido } from '../../../../core/pedido/entity/pedido.entity';

describe('PedidoGateway', () => {
  let gateway: PedidoGateway;
  let repository: IPedidoRepository;

  beforeEach(async () => {
    const pedidoRepositoryMock: Partial<IPedidoRepository> = {
      cadastrar: jest.fn(),
      listar: jest.fn(),
      editar: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidoGateway,
        { provide: IPedidoRepository, useValue: pedidoRepositoryMock },
      ],
    }).compile();

    gateway = module.get<PedidoGateway>(PedidoGateway);
    repository = module.get<IPedidoRepository>(IPedidoRepository);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('cadastrarPedido', () => {
    it('Deve chamar o pedido repository no metodo cadatrar com os parametros corretos', async () => {
      const pedido: Pedido = {
        id: '66464c987689ae49c5a342fd',
        status: 'created',
        produtosIds: [],
        clienteId: '123'
      };
      jest.spyOn(repository, 'cadastrar').mockResolvedValueOnce();
      const result = await gateway.cadastrarPedido(pedido);
      expect(repository.cadastrar).toHaveBeenCalledWith(pedido);
    });
  });

  describe('listarPedido', () => {
    it('Deve listar os produtos corretamente', async () => {
      const ids = ['id1', 'id2'];
      const arrayMatch = [{ $match: { "_id": { $in: ids.map(id => ({ "$oid": id })) } } }];
      jest.spyOn(repository, 'listar').mockResolvedValueOnce([]);
      await gateway.listarPedido({ ids });
      expect(repository.listar).toHaveBeenCalledWith(arrayMatch);
    });
  });

  describe('editarStatusPedido', () => {
    it('Deve chamar o pedido repository com os parametros corretos', async () => {
      const id = 'some-id';
      const status = 'processed';
      const pedidoModificado: Pedido = { id, status, clienteId: '123', produtosIds: [] };
      jest.spyOn(repository, 'editar').mockResolvedValueOnce(pedidoModificado);
      const result = await gateway.editarStatusPedido(id, status);
      expect(result).toEqual(pedidoModificado);
      expect(repository.editar).toHaveBeenCalledWith(id, 'status', status);
    });
  });
});
