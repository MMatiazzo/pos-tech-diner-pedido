import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ClientSession, Model } from "mongoose";
import { Pedido } from "src/core/pedido/entity/pedido.entity";
import { PedidoDocument } from "../../mongoose/schemas/pedido/pedido.schema";
import { IPedidoRepository } from "./Ipedido.repository";

@Injectable()
export class PedidoMongodbMongooseRepository implements IPedidoRepository {
  constructor(
    @InjectModel('pedidos')
    private pedidoModel: Model<PedidoDocument>
  ) { }

  async cadastrar(pedido: Pedido, session: ClientSession): Promise<any> {
    return this.pedidoModel.create([pedido], { session });
  }

  async listar(matchArray: any[]): Promise<any> {
    return this.pedidoModel.aggregate([
      ...matchArray,
      {
        $match: {}
      },
    ]);
  }

  async editar(id: string, field: string, value: string, session: ClientSession): Promise<Pedido> {
    return this.pedidoModel.findByIdAndUpdate(id, {
      [field]: value
    }, { new: true, session });
  }
}