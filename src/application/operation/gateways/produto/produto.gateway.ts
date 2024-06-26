import { Inject } from "@nestjs/common";
import { EditarProdutoDto } from "../../../../core/produto/dto/editar-produto.dto";
import { ListarProdutoDto } from "../../../../core/produto/dto/listar-produto.dto";
import { Produto } from "../../../../core/produto/entity/produto.entity";
import { IProdutoRepository } from "../../../../infrastructure/persistence/repositories/produto/Iproduto.repository";
import { IProdutoGateway } from "./Iproduto.gateway";
import { ObjectId } from "bson";

export class ProdutoGateway implements IProdutoGateway {
  constructor(
    @Inject(IProdutoRepository)
    private produtoRepository: IProdutoRepository
  ) { }

  async cadastrarProduto(produto: Produto): Promise<Produto> {
    const { id } = await this.produtoRepository.cadastrar(produto);
    return {
      ...produto,
      id,
    };
  }

  async listarProduto(payload: ListarProdutoDto): Promise<Produto[]> {
    const arrayMatch = [];

    const { categoria, nome, ids } = payload;

    if (categoria) {
      const categoriaMatch = {
        "$match": { categoria }
      }
      arrayMatch.push(categoriaMatch)
    }

    if (nome) {
      const nomeMatch = {
        "$match": { nome }
      }
      arrayMatch.push(nomeMatch)
    }

    if (ids) {
      const idsToSearch = ids.split(',').map(id => new ObjectId(id));
      const idMatch = {
        $match: {
          "_id": {
            $in: idsToSearch
          }
        }
      }
      arrayMatch.push(idMatch)
    }

    const produtos = await this.produtoRepository.listar(arrayMatch);
    return produtos;
  }

  async editarProduto(editarProdutoDto: EditarProdutoDto): Promise<void> {
    const { id, campo, valor } = editarProdutoDto;
    await this.produtoRepository.editar(id, campo, valor);
  }

  async deletarProduto(id: string): Promise<Produto | null> {
    const produtoDeleted = await this.produtoRepository.remover(id);
    return produtoDeleted;
  }
}