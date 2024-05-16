import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoGateway } from './produto.gateway';
import { ObjectId } from 'bson';
import { IProdutoRepository } from '../../../../infrastructure/persistence/repositories/produto/Iproduto.repository';
import { Produto } from '@prisma/client';
import { ListarProdutoDto } from '../../../../core/produto/dto/listar-produto.dto';
import { EditarProdutoDto } from '../../../../core/produto/dto/editar-produto.dto';

describe('ProdutoGateway', () => {
  let gateway: ProdutoGateway;
  let repository: IProdutoRepository;

  beforeEach(async () => {
    const produtoRepositoryMock: Partial<IProdutoRepository> = {
      cadastrar: jest.fn(),
      listar: jest.fn(),
      editar: jest.fn(),
      remover: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoGateway,
        { provide: IProdutoRepository, useValue: produtoRepositoryMock },
      ],
    }).compile();

    gateway = module.get<ProdutoGateway>(ProdutoGateway);
    repository = module.get<IProdutoRepository>(IProdutoRepository);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('cadastrarProduto', () => {
    it('Deve cadastrar um produto corretamente', async () => {
      const produto: Produto = { id: '1', nome: 'Product', preco: 10, categoria: 'Category', descricao: '', imagens: [] };
      const produtoWithId: Produto = { ...produto, id: '2' };
      jest.spyOn(repository, 'cadastrar').mockResolvedValueOnce({
        id: produtoWithId.id,
        nome: produtoWithId.nome,
        preco: produtoWithId.preco,
        categoria: produtoWithId.categoria,
        descricao: '',
        imagens: []
      });
      const result = await gateway.cadastrarProduto(produto);
      expect(result).toEqual(produtoWithId);
      expect(repository.cadastrar).toHaveBeenCalledWith(produto);
    });
  });

  describe('listarProduto', () => {
    it('Deve chamar o produto repository.listar com os parametros corretos', async () => {
      const payload: ListarProdutoDto = { categoria: 'Category', nome: 'Product', ids: '66464c90b08dce54855a3c7d,66464c987689ae49c5a342fd' };
      const produtos: Produto[] = [
        {
          id: '66464c90b08dce54855a3c7d',
          categoria: 'Category',
          descricao: '',
          imagens: [],
          nome: 'Product',
          preco: 10,

        },
        {
          id: '66464c987689ae49c5a342fd',
          categoria: 'Category',
          descricao: '',
          imagens: [],
          nome: 'Product',
          preco: 10,
        }
      ]; // sample produtos
      jest.spyOn(repository, 'listar').mockResolvedValueOnce(produtos);
      const result = await gateway.listarProduto(payload);
      expect(result).toEqual(produtos);
      expect(repository.listar).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ $match: { categoria: payload.categoria } }),
        expect.objectContaining({ $match: { nome: payload.nome } }),
        expect.objectContaining({ $match: { _id: { $in: payload.ids.split(',').map(id => new ObjectId(id)) } } })
      ]));
    });
  });

  describe('editarProduto', () => {
    it('Deve chamar o produto repository.editar com os parametros corretos', async () => {
      const editarProdutoDto: EditarProdutoDto = { id: 'some-id', campo: 'nome', valor: 'New Product' };
      await gateway.editarProduto(editarProdutoDto);
      expect(repository.editar).toHaveBeenCalledWith(editarProdutoDto.id, editarProdutoDto.campo, editarProdutoDto.valor);
    });
  });

  describe('deletarProduto', () => {
    it('Deve chamar o produto repository.deletar com os parametros corretos', async () => {
      const id = '123';
      const produtoDeleted: Produto = { id, nome: 'Product', preco: 10, categoria: 'Category', descricao: '', imagens: [] };
      jest.spyOn(repository, 'remover').mockResolvedValueOnce(produtoDeleted);
      const result = await gateway.deletarProduto(id);
      expect(result).toEqual(produtoDeleted);
      expect(repository.remover).toHaveBeenCalledWith(id);
    });
  });
});
