
export type EditarProdutoDto = {
  id: string;
  campo: 'nome' | 'preco' | 'descricao' | 'imagens' | 'categoria';
  valor: string | string[] | number;
};
