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
    console.log('-=-= PRODUTO REPOSITORY -=-=');
    console.log('produto inside the cadastrar function => ', produto);
    const novoProduto = await this.prisma.produto.create({
      data: produto
    });
    console.log('novo produto => ', novoProduto)
    return novoProduto;
  }

  editar(id: string, campo: string, valor: string | number | string[]): Promise<Produto> {
    throw new Error('Method not implemented.');
  }
  remover(id: string): Promise<Produto> {
    throw new Error('Method not implemented.');
  }
  buscarPorCategoria(categoria: string): Promise<Produto[]> {
    throw new Error('Method not implemented.');
  }
} 