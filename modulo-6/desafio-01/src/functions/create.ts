import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuid } from "uuid";
import { client as dynamodb } from "../utils/dinamodb";

interface Todos {
  id: string; // id gerado para garantir um único todo com o mesmo id
  user_id: string; // id do usuário recebido no pathParameters
  title: string;
  done: boolean; // inicie sempre como false
  deadline: Date;
}

export const create: APIGatewayProxyHandler = async (event) => {
  const { userid } = event.pathParameters;

  const { title, deadline } = JSON.parse(event.body) as Todos;

  const params = {
    TableName: "todos",
    Item: {
      id: uuid(),
      user_id: userid,
      title,
      done: false,
      deadline,
    },
  };

  await dynamodb.put(params).promise();
  return {
    statusCode: 201,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params.Item),
  };
};
