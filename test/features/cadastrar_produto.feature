Feature: Cadastrar Produto

  Scenario: Cadastrar Produto
    Given A module to create a new product
    When Call to cadastrarProdutoController
    Then The response product should be named "Produto Teste"