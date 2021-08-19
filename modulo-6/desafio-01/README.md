# Desafio 01 - Construindo com serverless

## 💻 Sobre o desafio

Nesse desafio você irá recriar uma parte da API de *todos* que foi desenvolvida no desafio [Conceitos do Node.js](https://www.notion.so/Desafio-01-Conceitos-do-Node-js-59ccb235aecd43a6a06bf09a24e7ede8) mas dessa vez deverá ser usado o framework [Serverless](https://www.serverless.com/).

Para rodar o projeto:

```bash
  # instalar dependencias
  $ yarn
  
  # instalar dynamodb local
  $ serverless dynamodb install
  
  # rodar o dynamodb
  $ serverless dynamodb start
    
  # rodar o serverless offline
  $ serverless offline
```

Cada funcionalidade deverá ser criada em um arquivo de função separada de acordo com o que foi visto nesse último módulo.
As rotas que deverão existir são:

**POST -** `/todos/{userid}`

**GET-** `/todos/{userid}`

### Sobre as rotas

<a href="https://insomnia.rest/run/?label=serverless%20challenge&uri=https%3A%2F%2Fgist.githubusercontent.com%2Fmarchetti2%2F425fe0cdfb6ef828f1e65987dcaa3733%2Fraw%2F95beb59d62d22ae40af3119120cefd84b8a93833%2Fserverless.json" target="_blank"><img src="https://insomnia.rest/images/run.svg" alt="Run in Insomnia"></a>

- **POST -** `/todos/{userid}`

    Essa rota deve receber o `id` de um usuário pelo `pathParameters` (você pode criar esse id manualmente apenas para preencher o campo) e os seguintes campos no corpo da requisição: `title` e `deadline`, onde `deadline` é a data limite para o *todo*.

    O *todo* deverá ser salvo com os seguintes campos no DynamoDB:

    ```js
    { 
    	id: 'uuid', // id gerado para garantir um único todo com o mesmo id
    	user_id: 'uuid' // id do usuário recebido no pathParameters
    	title: 'Nome da tarefa',
    	done: false, // inicie sempre como false
    	deadline: new Date(deadline)
    }
    ``` 

- **GET-** `/todos/{userid}`

    Essa rota deve receber o `id` de um usuário pelo `pathParameters` (o mesmo id que foi usado para criar algum *todo*).

    A rota deve retornar os *todos* que possuírem o `user_id` igual ao `id` recebido pelos parâmetros.
