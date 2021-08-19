import { Connection, createConnection } from "typeorm";
import { validate, v4 as uuid } from "uuid";

import { User } from "../../../../modules/users/entities/User";
import { Statement } from "../../../../modules/statements/entities/Statement";
import { UsersRepository } from "../../../../modules/users/repositories/UsersRepository";
import { StatementsRepository } from "../../../../modules/statements/repositories/StatementsRepository";
import { GetBalanceUseCase } from "../../../../modules/statements/useCases/getBalance/GetBalanceUseCase";
import { CreateUserUseCase } from "../../../../modules/users/useCases/createUser/CreateUserUseCase";
import { GetStatementOperationUseCase } from "../../../../modules/statements/useCases/getStatementOperation/GetStatementOperationUseCase";
import { CreateStatementUseCase } from "../../../../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "../../../../modules/statements/useCases/getStatementOperation/GetStatementOperationError";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("CreateUserUseCase", () => {
  let connection: Connection;
  let user: User;
  let statement: Statement;

  let usersRepository: UsersRepository;
  let statementsRepository: StatementsRepository;

  let createUserUseCase: CreateUserUseCase;
  let getBalanceUseCase: GetBalanceUseCase;
  let getStatementOperationUseCase: GetStatementOperationUseCase;
  let createStatementUseCase: CreateStatementUseCase;

  beforeAll(async () => {
    connection = await createConnection();

    usersRepository = new UsersRepository();
    statementsRepository = new StatementsRepository();

    createUserUseCase = new CreateUserUseCase(usersRepository);
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      usersRepository
    );

    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository
    );

    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );

    await connection.createQueryRunner().dropTable("statements", true);
    await connection.createQueryRunner().dropTable("users", true);
    await connection.createQueryRunner().dropTable("migrations", true);
    await connection.runMigrations();
  });

  afterAll(() => {
    connection.close();
  });

  it("Should be able to get a user statement operation", async () => {
    user = await createUserUseCase.execute({
      email: "marchetti2@gmail.com",
      password: "123456",
      name: "Mario Luiz",
    });

    statement = await createStatementUseCase.execute({
      user_id: String(user.id),
      amount: 50,
      description: "wages",
      type: "deposit" as OperationType,
    });

    const response = await getStatementOperationUseCase.execute({
      user_id: String(user.id),
      statement_id: String(statement.id),
    });

    expect(response).toHaveProperty("id");
    expect(validate(String(response.id))).toBe(true);
    expect(response.user_id).toBe(user.id);
    expect(response.created_at).toBeInstanceOf(Date);
    expect(response.updated_at).toBeInstanceOf(Date);
  });

  it("Should not be able to get a non existing user statement operation", async () => {
    await expect(
      getStatementOperationUseCase.execute({
        user_id: uuid(),
        statement_id: String(statement.id),
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("Should not be able to get a non existing statement operation", async () => {
    await expect(
      getStatementOperationUseCase.execute({
        user_id: String(user.id),
        statement_id: uuid(),
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
