import { Inject, Injectable } from "@nestjs/common";
import { Pedido } from "src/core/pedido/entity/pedido.entity";
import { PrismaService } from "../../prisma/prisma.service";
import { IPedidoRepository } from "./Ipedido.repository";

@Injectable()
export class PedidoMongoDbRepository implements IPedidoRepository {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService
  ) { }

  async cadastrar(pedido: Pedido): Promise<any> {
    return this.prisma.pedido.create({ data: pedido });
  }

  async listar(matchArray: any[]): Promise<any> {
    const pedidoCriado = await this.prisma.pedido.aggregateRaw({
      pipeline: [...matchArray]
    });
    return pedidoCriado;
  }

  async editar(id: string, field: string, value: string): Promise<Pedido> {
    const pedido = await this.prisma.pedido.update({
      where: { id },
      data: {
        [field]: value,
      },
    });
    return pedido;
  }
}