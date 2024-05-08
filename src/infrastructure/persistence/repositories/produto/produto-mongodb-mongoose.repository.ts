import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Produto } from "src/core/produto/entity/produto.entity";
import { ProdutoDocument, ProdutoModel } from "../../mongoose/schemas/produto/produto.schema";
import { IProdutoRepository } from "./Iproduto.repository";

@Injectable()
export class ProdutoMongodbMongooseRepository implements IProdutoRepository {
  constructor(
    @InjectModel('produtos')
    private produtoModel: Model<ProdutoDocument>
  ) { }
  async cadastrar(produto: Produto): Promise<any> {
    return this.produtoModel.create(produto);
  }
  editar(id: string, campo: string, valor: string | number | string[]): Promise<Produto> {
    return this.produtoModel.findByIdAndUpdate(id, { [campo]: valor });
  }
  async remover(id: string): Promise<Produto> {
    const produto = await this.produtoModel.findByIdAndDelete(id);
    return produto;
  }
  listar(mathArray: any[]): Promise<any> {
    return this.produtoModel.aggregate([
      ...mathArray,
      {
        $match: {}
      },
    ]);
  }

}