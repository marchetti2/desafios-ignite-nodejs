import { Connection, createConnection } from "typeorm";
import { validate, v4 as uuid } from "uuid";

import { User } from "../../../../modules/users/entities/User";
import { UsersRepository } from "../../../../modules/users/repositories/UsersRepository";
import { StatementsRepository } from "../../../../modules/statements/repositories/StatementsRepository";
import { CreateStatementUseCase } from "../../../../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { CreateUserUseCase } from "../../../../modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementError } from "../../../../modules/statements/useCases/createStatement/CreateStatementError";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("CreateStatementUseCase", () => {
  let connection: Connection;
  let user: User;

  let usersRepository: UsersRepository;
  let statementsRepository: StatementsRepository;

  let createUserUseCase: CreateUserUseCase;
  let createStatementUseCase: CreateStatementUseCase;

  beforeAll(async () => {
    connection = await createConnection();

    usersRepository = new UsersRepository();
    statementsRepository = new StatementsRepository();

    createUserUseCase = new CreateUserUseCase(usersRepository);
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

  it("Should be able to make a deposit", async () => {
    user = await createUserUseCase.execute({
      email: "marchetti2@gmail.com",
      password: "123456",
      name: "Mario Luiz",
    });

    const deposit = await createStatementUseCase.execute({
      user_id: String(user.id),
      amount: 50,
      description: "wages",
      type: "deposit" as OperationType,
    });

    expect(deposit).toHaveProperty("id");
    expect(deposit.type).toBe("deposit");
    expect(validate(String(deposit.id))).toBe(true);
    expect(deposit.user_id).toBe(user.id);
    expect(deposit.created_at).toBeInstanceOf(Date);
    expect(deposit.updated_at).toBeInstanceOf(Date);
  });

  it("Should be able to make a withdraw", async () => {
    const withdraw = await createStatementUseCase.execute({
      user_id: String(user.id),
      amount: 40,
      description: "rent",
      type: "withdraw" as OperationType,
    });

    expect(withdraw).toHaveProperty("id");
    expect(withdraw.type).toBe("withdraw");
    expect(validate(String(withdraw.id))).toBe(true);
    expect(withdraw.user_id).toBe(user.id);
    expect(withdraw.created_at).toBeInstanceOf(Date);
    expect(withdraw.updated_at).toBeInstanceOf(Date);
  });

  it("Should not be able to make a withdraw if there are not enough funds", async () => {
    await expect(
      createStatementUseCase.execute({
        user_id: String(user.id),
        amount: 40,
        description: "rent",
        type: "withdraw" as OperationType,
      })
    ).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it("Should not be able to make a deposit with a non existing user", async () => {
    await expect(
      createStatementUseCase.execute({
        user_id: uuid(),
        amount: 40,
        description: "wages",
        type: "deposit" as OperationType,
      })
    ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("Should not be able to make a withdraw with a non existing user", async () => {
    await expect(
      createStatementUseCase.execute({
        user_id: uuid(),
        amount: 40,
        description: "rent",
        type: "withdraw" as OperationType,
      })
    ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
});
