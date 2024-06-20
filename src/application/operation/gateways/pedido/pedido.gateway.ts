import { Inject } from "@nestjs/common";
import { Pedido } from "../../../../core/pedido/entity/pedido.entity";
import { IPedidoRepository } from "../../../../infrastructure/persistence/repositories/pedido/Ipedido.repository";
import { IPedidoGateway } from "./Ipedido.gateway";
import { ListarPedidoDto } from "../../../../core/pedido/dto/listar-pedido.dto";
import { ClientSession } from "mongoose";

export class PedidoGateway implements IPedidoGateway {
  constructor(
    @Inject(IPedidoRepository)
    private pedidoRepository: IPedidoRepository
  ) { }

  async cadastrarPedido(pedido: Pedido, session: ClientSession): Promise<any> {
    return this.pedidoRepository.cadastrar(pedido, session);
  }

  async listarPedido({ ids }: ListarPedidoDto) {

    let arrayMatch = [];
    if (ids?.length) {
      const idMatch = {
        $match: {
          "_id": {
            $in: ids.map(id => ({ "$oid": id }))
          }
        }
      }
      arrayMatch.push(idMatch)
    }

    return this.pedidoRepository.listar(arrayMatch);
  }

  async editarStatusPedido(id: string, status: string, session: ClientSession): Promise<Pedido> {
    const pedidoModificado = await this.pedidoRepository.editar(id, 'status', status, session);
    return pedidoModificado;
  }
}