# Desafio 01 - Transferências com a FinAPI

## 💻 Sobre o desafio

<a href="https://insomnia.rest/run/?label=finapi&uri=https%3A%2F%2Fgist.githubusercontent.com%2Fmarchetti2%2F9083497bcad3d0b66d740ebed29c1068%2Fraw%2Fde265726a2fc928e52dd6e27602b41d2f1392221%2Ftransferencias_fin_api.json" target="_blank"><img src="https://insomnia.rest/images/run.svg" alt="Run in Insomnia"></a>

Nesse desafio você irá implementar uma nova funcionalidade na FinAPI, a aplicação que foi testada durante o desafio **[Testes unitários](https://www.notion.so/Desafio-01-Testes-unit-rios-0321db2af07e4b48a85a1e4e360fcd11)**.

A nova funcionalidade deverá permitir a transferência de valores entre contas. Para isso, você pode pensar na melhor forma de construir essa solução mas alguns requisitos deverão ser cumpridos:

- Não deve ser possível transferir valores superiores ao disponível no saldo de uma conta;
- O balance (obtido através da rota `/api/v1/statements/balance`) deverá considerar também todos os valores transferidos ou recebidos através de transferências ao exibir o saldo de um usuário;
- As informações para realizar uma transferência serão:

    ```json
    {
    	"amount": 100,
    	"description": "Descrição da transferência"
    }
    ```

    Você pode passar o `id` do usuário destinatário via parâmetro na rota (exemplo: `/api/v1/statements/transfers/:user_id`) e o id do usuário remetente poderá ser obtido através do token JWT enviado no header da requisição;

- Ao mostrar o balance de um usuário, operações do tipo `transfer` deverão possuir os seguintes campos:

    ```js
    {
      "id": "4d04b6ec-2280-4dc2-9432-8a00f64e7930",
    	"sender_id": "cfd06865-11b9-412a-aa78-f47cc3e52905"
      "amount": 100,
      "description": "Transferência de valor",
      "type": "transfer",
      "created_at": "2021-03-26T21:33:11.370Z",
      "updated_at": "2021-03-26T21:33:11.370Z"
    }
    ```

    Observe o campo `sender_id`. Esse deverá ser o `id` do usuário que enviou a transferência.
    O campo `type` também deverá exibir o tipo da operação, que nesse caso é `transfer`.

---

Esse desafio não possui testes. Você poderá realizar as alterações no mesmo repositório usado para o desafio de testes unitários e submeter novamente na plataforma.

## Banco de dados

Para ter o funcionamento normal da aplicação durante os testes de integração é importante que você confira os dados de autenticação do banco no arquivo `ormconfig.json` e, se necessário, altere.

Além disso você precisa criar uma database com o nome `fin_api` de acordo com o que está no arquivo de configurações do TypeORM antes de rodar as migrations.

Usando o **docker**, inicie uma instância do postgres.

```bash
  # PostgreSQL
  $ docker run --name postgres -e POSTGRES_DB=fin_api -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres

  $ docker start postgres
```

