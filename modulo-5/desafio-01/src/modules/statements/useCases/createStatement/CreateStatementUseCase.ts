import { inject, injectable } from "tsyringe";
import { validate } from "uuid";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

@injectable()
export class CreateStatementUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({
    receiver_id,
    user_id,
    type,
    amount,
    description,
  }: ICreateStatementDTO) {
    if (receiver_id) {
      const userValidate = validate(receiver_id);

      if (userValidate === false) {
        throw new CreateStatementError.UserNotFound();
      }

      if (receiver_id === user_id) {
        throw new CreateStatementError.InvalidRequest();
      }

      const user = await this.usersRepository.findById(receiver_id);

      if (!user) {
        throw new CreateStatementError.UserNotFound();
      }

      await this.statementsRepository.create({
        user_id: receiver_id,
        type: "transfer_received",
        amount,
        description,
      });

      const statementOperation = await this.statementsRepository.create({
        user_id,
        type: "transfer_sent",
        amount,
        description,
      });

      return statementOperation;
    }

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new CreateStatementError.UserNotFound();
    }

    if (type !== "deposit") {
      const { balance } = await this.statementsRepository.getUserBalance({
        user_id,
      });

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds();
      }
    }

    const statementOperation = await this.statementsRepository.create({
      user_id,
      type,
      amount,
      description,
    });

    return statementOperation;
  }
}
