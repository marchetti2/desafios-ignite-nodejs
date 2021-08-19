import { Connection, createConnection } from "typeorm";
import { v4 as uuid } from "uuid";

import { User } from "../../../../modules/users/entities/User";
import { UsersRepository } from "../../../../modules/users/repositories/UsersRepository";
import { StatementsRepository } from "../../../../modules/statements/repositories/StatementsRepository";
import { GetBalanceUseCase } from "../../../../modules/statements/useCases/getBalance/GetBalanceUseCase";
import { CreateUserUseCase } from "../../../../modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../../../../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { GetBalanceError } from "../../../../modules/statements/useCases/getBalance/GetBalanceError";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("GetBalanceUseCase", () => {
  let connection: Connection;
  let user: User;

  let usersRepository: UsersRepository;
  let statementsRepository: StatementsRepository;

  let createUserUseCase: CreateUserUseCase;
  let getBalanceUseCase: GetBalanceUseCase;
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

  it("Should be able to get a user balance", async () => {
    user = await createUserUseCase.execute({
      email: "marchetti2@gmail.com",
      password: "123456",
      name: "Mario Luiz",
    });

    await createStatementUseCase.execute({
      user_id: String(user.id),
      amount: 50,
      description: "wages",
      type: "deposit" as OperationType,
    });

    await createStatementUseCase.execute({
      user_id: String(user.id),
      amount: 40,
      description: "rent",
      type: "withdraw" as OperationType,
    });

    const response = await getBalanceUseCase.execute({
      user_id: String(user.id),
    });

    expect(response).toHaveProperty("balance");
    expect(response.statement).toHaveLength(2);
    expect(response.balance).toBe(10);
  });

  it("Should not be able to get a non existing user balance", async () => {
    await expect(
      getBalanceUseCase.execute({
        user_id: uuid(),
      })
    ).rejects.toBeInstanceOf(GetBalanceError);
  });
});
