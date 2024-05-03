
export type CriaPedidoDto = {
  produtosIds: string[];
};

export type NewPedidoDto = {
  status: string;
  produtosIds: string[];
  clienteId?: string;
}
