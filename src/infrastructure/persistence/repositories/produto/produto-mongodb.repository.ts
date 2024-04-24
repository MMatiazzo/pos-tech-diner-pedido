import { Inject, Injectable } from '@nestjs/common';
import { IProdutoRepository } from './Iproduto.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { Produto } from 'src/core/produto/entity/produto.entity';

@Injectable()
export class ProdutoMongoDbRepository implements IProdutoRepository {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService
  ) { }

  async cadastrar(produto: Produto): Promise<Produto> {
    const novoProduto = await this.prisma.produto.create({
      data: produto
    });
    return novoProduto;
  }

  editar(id: string, campo: string, valor: string | number | string[]): Promise<Produto> {
    throw new Error('Method not implemented.');
  }

  remover(id: string): Promise<Produto> {
    throw new Error('Method not implemented.');
  }

  async listar(mathArray: any[]): Promise<any> {
    return this.prisma.produto.aggregateRaw({
      pipeline: [
        ...mathArray
      ]
    });
  }
} 