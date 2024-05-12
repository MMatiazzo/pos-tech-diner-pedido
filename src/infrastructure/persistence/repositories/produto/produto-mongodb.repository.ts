import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IProdutoRepository } from './Iproduto.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { Produto } from 'src/core/produto/entity/produto.entity';
import { PrismaClientValidationError, PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ProdutoMongoDbRepository implements IProdutoRepository {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService
  ) { }

  async cadastrar(produto: Produto): Promise<Produto> {
    try {
      const novoProduto = await this.prisma.produto.create({
        data: produto
      });

      return novoProduto;
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException('Produto inválido');
      }
      throw error;
    }

  }

  async editar(id: string, campo: string, valor: string | number | string[]): Promise<Produto> {
    const updateData = { [campo]: valor };
    return this.prisma.produto.update({
      where: {
        id,
      },
      data: updateData
    });
  }

  async remover(id: string): Promise<Produto | null> {
    try {
      const produto = await this.prisma.produto.delete({
        where: {
          id,
        },
      });

      return produto;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Produto não encontrado');
      }
      throw error;
    }
  }

  async listar(mathArray: any[]): Promise<any> {
    return this.prisma.produto.aggregateRaw({
      pipeline: [
        ...mathArray
      ]
    });
  }
} 