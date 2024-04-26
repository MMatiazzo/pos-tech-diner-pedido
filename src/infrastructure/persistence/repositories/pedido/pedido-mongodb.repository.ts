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

  async cadastrar(pedido: Pedido): Promise<Pedido> {
    const pedidoCriado = await this.prisma.pedido.create({ data: pedido });
    console.log('pedidoCriado => ', pedidoCriado);
    return null;
  }

  async listar(matchArray: any[]): Promise<any> {
    const pedidoCriado = await this.prisma.pedido.aggregateRaw({
      pipeline: [...matchArray]
    });
    return pedidoCriado;
  }
}