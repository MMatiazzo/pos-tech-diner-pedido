import { NewPedidoDto } from "../dto/cria-pedido.dto";

export enum CardinalDirections {
  AGUARDANDO_PAGAMENTO = 'Aguardando_Pagamento',
  PAGAMENTO_RECUSADO = 'Pagamento_Recusado',
  PAGAMENTO_CONFIRMADO = 'Recebido',
  EM_PREPARACAO = "Em_preparacao",
  PRONTO = 'Pronto',
  FINALIZADO = 'Finalizado'
};

export class Pedido {
  id?: string;
  status: string;
  produtosIds: string[];
  cpf?: string;
  email?: string;

  private constructor(payload: NewPedidoDto) {
    this.status = payload.status;
    this.produtosIds = payload.produtosIds;
    if (payload?.cpf) this.cpf = payload.cpf;
    if (payload?.email) this.email = payload.email;
  }

  public static new(payload: NewPedidoDto) {
    const pedido = new Pedido(payload);
    return pedido;
  }
}