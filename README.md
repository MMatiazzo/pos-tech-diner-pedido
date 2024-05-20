# 📁 PEDIDO ms
# Micro serviço de pedido

<br>
Utilizar a branch principal `master`
<br>
Substituir a váriavel DATABASE_URL com a connection string mongodb
<br>
Executar o comando `npm run start:dev`

##### A collection com os requests está no arquivo `micro-services.postman_collection.json` na pasta `PEDIDO`

## End-point: cadastrar-produto
#### End-point para fazer o cadastro de um produto
### Method: POST
>```
>{{base_url}}/produto/cadastrar
>```
### Body (**raw**)

```json
{
    "nome": "Whooper",
    "categoria": "Lanche Muito bom",
    "preco": 10,
    "descricao": "Lanche para a maioria",
    "imagens": []
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: listar-produto
#### End-point para fazer listar produtos
### Method: GET
>```
>{{base_url}}/produto/listar
>```
### Query Params

|Param|value|
|---|---|
|categoria|Lanche 4|



⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: editar-produto
#### End-point para editar um produto pelo id
### Method: PATCH
>```
>{{base_url_local}}/produto/editar
>```
### Body (**raw**)

```json
{
    "id": "6627f490f1a2eb2a7bb180a8",
    "campo": "nome",
    "valor": "mudou"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: deletar-produto
#### End-point para deletar um produto
### Method: DELETE
>```
>{{base_url_local}}/produto/deletar/{{produto_id_to_delete}}
>```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: cadastrar-pedido
#### End-point para fazer o cadastro de um pedido
### Method: POST
>```
>{{base_url}}/pedido/cadastrar
>```
### Body (**raw**)

```json
{
    "produtosIds": ["66428981d89622195f7a44f6"]
}
```

### 🔑 Authentication bearer
#### Aqui é necessário um token de autenticação para retornar o usuário

|Param|value|Type|
|---|---|---|
|token|{{token}}|string|



⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: editar-pedido
#### End-point para editar o status de um pedido pelo id
### Method: PATCH
>```
>{{base_url}}/pedido/editar-status
>```
### Body (**raw**)

```json
{
    "id": "663f8cee5f8395e090f3d4de",
    "status": "Recebido"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: listar-pedido
#### End-point para listar os pedidos
### Method: GET
>```
>{{base_url}}/pedido/listar
>```
### Body (**raw**)

```json

```

### Query Params

|Param|value|
|---|---|
|ids|662b9ec7a035906dae37f858|
