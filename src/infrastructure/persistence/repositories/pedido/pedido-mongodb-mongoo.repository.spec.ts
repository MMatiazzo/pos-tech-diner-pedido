import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PedidoMongodbMongooseRepository } from './pedido-mongodb-mongoose.repository';
import { Model } from 'mongoose';
import { PedidoDocument } from '../../mongoose/schemas/pedido/pedido.schema';
import { Pedido } from 'src/core/pedido/entity/pedido.entity';

describe('PedidoMongodbMongooseRepository', () => {
  let repository: PedidoMongodbMongooseRepository;
  let model: Model<PedidoDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidoMongodbMongooseRepository,
        {
          provide: getModelToken('pedidos'),
          useValue: {
            create: jest.fn(),
            aggregate: jest.fn(),
            findByIdAndUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<PedidoMongodbMongooseRepository>(
      PedidoMongodbMongooseRepository,
    );
    model = module.get<Model<PedidoDocument>>(getModelToken('pedidos'));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('cadastrar', () => {
    it('Deve criar um pedido', async () => {
      const pedidoData: Pedido = {
        produtosIds: [],
        status: 'Aguardando_pagamento',
      }; // Add your pedido data here
      await repository.cadastrar(pedidoData);
      expect(model.create).toHaveBeenCalledWith(pedidoData);
    });
  });

  describe('listar', () => {
    it('Deve listar os pedidos', async () => {
      const matchArray = [{}]; // Add your match array here
      await repository.listar(matchArray);
      expect(model.aggregate).toHaveBeenCalledWith([...matchArray, { $match: {} }]);
    });
  });

  describe('editar', () => {
    it('Deve editar um pedido pelo id', async () => {
      const id = '123';
      const field = 'status';
      const value = 'Recebido';
      await repository.editar(id, field, value);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(id, { [field]: value }, { new: true });
    });
  });
});
