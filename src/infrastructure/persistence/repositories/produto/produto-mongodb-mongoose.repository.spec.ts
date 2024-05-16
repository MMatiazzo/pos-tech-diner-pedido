import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ProdutoMongodbMongooseRepository } from './produto-mongodb-mongoose.repository';
import { Model } from 'mongoose';
import { ProdutoDocument } from '../../mongoose/schemas/produto/produto.schema';
import { Produto } from 'src/core/produto/entity/produto.entity';

describe('ProdutoMongodbMongooseRepository Test Suite', () => {
  let repository: ProdutoMongodbMongooseRepository;
  let model: Model<ProdutoDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoMongodbMongooseRepository,
        {
          provide: getModelToken('produtos'),
          useValue: {
            create: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            aggregate: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<ProdutoMongodbMongooseRepository>(
      ProdutoMongodbMongooseRepository,
    );
    model = module.get<Model<ProdutoDocument>>(getModelToken('produtos'));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('cadastrar', () => {
    it('Cadastrar pedido', async () => {
      const produtoData: Produto = {
        categoria: 'Lanche',
        descricao: 'muito bom',
        imagens: [],
        nome: 'nome 1',
        preco: 10,
      }; // Add your produto data here
      await repository.cadastrar(produtoData);
      expect(model.create).toHaveBeenCalledWith(produtoData);
    });
  });

  describe('editar', () => {
    it('Editar produto pelo id', async () => {
      const id = 'some-id';
      const campo = 'some-field';
      const valor = 'some-value';
      await repository.editar(id, campo, valor);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(id, { [campo]: valor });
    });
  });

  describe('remover', () => {
    it('Deve remover um produto pelo id', async () => {
      const id = 'some-id';
      await repository.remover(id);
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(id);
    });
  });

  describe('listar', () => {
    it('Deve listar os produtos', async () => {
      const matchArray = [{}]; // Add your match array here
      await repository.listar(matchArray);
      expect(model.aggregate).toHaveBeenCalledWith([...matchArray, { $match: {} }]);
    });
  });
});
