import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { StatementTypeMap } from "../../mappers/StatementTypeMap";

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { amount, description } = request.body;

    const createStatement = container.resolve(CreateStatementUseCase);

    const splittedPath = request.originalUrl.split("/");

    if (splittedPath.length > 5) {
      const { user_id: receiver_id } = request.params;

      const type = splittedPath[splittedPath.length - 2];

      const statement = await createStatement.execute({
        receiver_id,
        user_id,
        type,
        amount,
        description,
      });

      const statementTypeDTO = StatementTypeMap.toDTO(statement);

      return response.status(201).json(statementTypeDTO);
    }

    const type = splittedPath[splittedPath.length - 1];

    const statement = await createStatement.execute({
      user_id,
      type,
      amount,
      description,
    });

    return response.status(201).json(statement);
  }
}
