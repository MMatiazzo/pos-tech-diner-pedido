import * as mongoose from "mongoose";

import { Pedido } from "src/core/pedido/entity/pedido.entity";

interface IPedidoSchema {
  status: string;
  produtosIds: string[];
  clienteId?: string;
}

export const PedidoSchema = new mongoose.Schema(
  {
    status: { type: String, require: true },
    produtosIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Produto',
      require: true
    },
    clienteId: { type: String, require: false },
  },
  { timestamps: true }
);

export type PedidoDocument = mongoose.HydratedDocument<IPedidoSchema>;
export const PedidoModel = mongoose.model<PedidoDocument>('Pedido', PedidoSchema);