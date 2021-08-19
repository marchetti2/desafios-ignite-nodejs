import { Connection, createConnection, QueryFailedError } from "typeorm";
import { validate, v4 as uuid } from "uuid";

import { UsersRepository } from "../../../modules/users/repositories/UsersRepository";
import { StatementsRepository } from "../../../modules/statements/repositories/StatementsRepository";

import { User } from "../../../modules/users/entities/User";
import { Statement } from "../../../modules/statements/entities/Statement";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("StatementsRepository", () => {
  let connection: Connection;
  let user: User;
  let deposit: Statement;
  let withdraw: Statement;

  let statementsRepository: StatementsRepository;
  let usersRepository: UsersRepository;

  beforeAll(async () => {
    connection = await createConnection();

    statementsRepository = new StatementsRepository();
    usersRepository = new UsersRepository();

    await connection.createQueryRunner().dropTable("statements", true);
    await connection.createQueryRunner().dropTable("users", true);
    await connection.createQueryRunner().dropTable("migrations", true);

    await connection.runMigrations();

    user = await usersRepository.create({
      name: "Mario Luiz",
      email: "marchetti2@gmail.com",
      password: "123123123",
    });
  });

  afterAll(() => {
    connection.close();
  });

  it("Should be able to make a deposit", async () => {
    deposit = await statementsRepository.create({
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
    withdraw = await statementsRepository.create({
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

  it("Should be able to get a user balance", async () => {
    const response = await statementsRepository.getUserBalance({
      user_id: String(user.id),
      with_statement: true,
    });

    expect(response).toHaveProperty("balance");
    expect(response.balance).toBe(10);
  });

  it("Should not be able to make a statement with a non existing user", async () => {
    await expect(
      statementsRepository.create({
        user_id: uuid(),
        amount: 40,
        description: "wages",
        type: "deposit" as OperationType,
      })
    ).rejects.toBeInstanceOf(QueryFailedError);
  });

  it("Should be able to get a user statement operation", async () => {
    const response = await statementsRepository.findStatementOperation({
      statement_id: String(deposit.id),
      user_id: String(deposit.user_id),
    });

    expect(response).toHaveProperty("id");
    expect(validate(String(response?.id))).toBe(true);
    expect(response?.user_id).toBe(user.id);
    expect(response?.created_at).toBeInstanceOf(Date);
    expect(response?.updated_at).toBeInstanceOf(Date);
  });

  it("Should not be able to get a non existing user statement operation", async () => {

    expect(
      await statementsRepository.findStatementOperation({
        user_id: uuid(),
        statement_id: String(deposit.id),
      })
    ).toBe(undefined);
  });

  it("Should not be able to get a non existing statement operation", async () => {
    expect(
      await statementsRepository.findStatementOperation({
        user_id: String(user.id),
        statement_id: uuid(),
      })
    ).toBe(undefined);
  });
});
