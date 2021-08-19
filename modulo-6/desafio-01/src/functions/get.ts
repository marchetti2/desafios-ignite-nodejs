import { APIGatewayEvent, APIGatewayProxyHandler } from "aws-lambda";
import { client as dynamodb } from "../utils/dinamodb";

/*
id:
1
747ec0d7-6550-43a0-8fc0-402f711a3f2a
ddbb4b08-7946-48cd-ba28-43a1f5131c9b
*/

export const get: APIGatewayProxyHandler = async (event) => {
  const { userid } = event.pathParameters;

  const response = await dynamodb
    .scan({
      TableName: "todos",
    })
    .promise();

  const todos = response.Items.filter((todo) => todo.user_id === userid);

  return {
    statusCode: 200,
    body: JSON.stringify(todos),
  };
};
