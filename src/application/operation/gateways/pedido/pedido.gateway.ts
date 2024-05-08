import { Inject } from "@nestjs/common";
import { Pedido } from "src/core/pedido/entity/pedido.entity";
import { IPedidoRepository } from "src/infrastructure/persistence/repositories/pedido/Ipedido.repository";
import { IPedidoGateway } from "./Ipedido.gateway";
import { ListarPedidoDto } from "src/core/pedido/dto/listar-pedido.dto";

export class PedidoGateway implements IPedidoGateway {
  constructor(
    @Inject(IPedidoRepository)
    private pedidoRepository: IPedidoRepository
  ) { }

  async cadastrarPedido(pedido: Pedido): Promise<any> {
    return this.pedidoRepository.cadastrar(pedido);
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

  async editarStatusPedido(id: string, status: string): Promise<Pedido> {
    const pedidoModificado = await this.pedidoRepository.editar(id, 'status', status);
    return pedidoModificado;
  }
}