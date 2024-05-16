import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { EditarProdutoUseCase } from './editar-produto.usecase';
import { IProdutoGateway } from '../../../../application/operation/gateways/produto/Iproduto.gateway';
import { EditarProdutoDto } from '../../dto/editar-produto.dto';

describe('EditarProdutoUseCase', () => {
  let useCase: EditarProdutoUseCase;
  let produtoGateway: IProdutoGateway;

  beforeEach(async () => {
    const produtoGatewayMock: Partial<IProdutoGateway> = {
      editarProduto: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EditarProdutoUseCase,
        { provide: IProdutoGateway, useValue: produtoGatewayMock },
      ],
    }).compile();

    useCase = module.get<EditarProdutoUseCase>(EditarProdutoUseCase);
    produtoGateway = module.get<IProdutoGateway>(IProdutoGateway);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('Deve gerar execao quando o payload for errado', async () => {
      const payload: EditarProdutoDto = { campo: 'nome', valor: 123, id: '1' }; // incorrect payload, value should be string
      await expect(useCase.execute(payload)).rejects.toThrow(BadRequestException);
    });

    it('Deve ser capaz de editar um produto', async () => {
      const payload: EditarProdutoDto = { campo: 'nome', valor: '123', id: '1' };
      await useCase.execute(payload);
      expect(produtoGateway.editarProduto).toHaveBeenCalledWith(payload);
    });
  });
});
