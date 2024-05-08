import * as mongoose from "mongoose";

interface IProdutoSchema {
  nome: string;
  categoria: string;
  preco: number;
  descricao: string;
  imagens: string[];
}

export const ProdutoSchema = new mongoose.Schema(
  {
    nome: { type: String, require: true },
    categoria: { type: String, require: true },
    preco: { type: Number, require: true },
    descricao: { type: String, require: false },
    imagens: { type: [String], require: false },
  },
  { timestamps: true }
);

export type ProdutoDocument = mongoose.HydratedDocument<IProdutoSchema>;
export const ProdutoModel = mongoose.model('Produto', ProdutoSchema);