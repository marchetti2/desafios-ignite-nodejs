import { Connection, createConnection } from "typeorm";
import { UsersRepository } from "../../../../modules/users/repositories/UsersRepository";
import { CreateUserUseCase } from "../../../../modules/users/useCases/createUser/CreateUserUseCase";
import { IncorrectEmailOrPasswordError } from "../../../../modules/users/useCases/authenticateUser/IncorrectEmailOrPasswordError";
import { AuthenticateUserUseCase } from "../../../../modules/users/useCases/authenticateUser/AuthenticateUserUseCase";

describe("AuthenticateUserUseCase", () => {
  let connection: Connection;

  let usersRepository: UsersRepository;

  let createUserUseCase: CreateUserUseCase;
  let authenticateUserUseCase: AuthenticateUserUseCase;

  beforeAll(async () => {
    connection = await createConnection();

    usersRepository = new UsersRepository();

    createUserUseCase = new CreateUserUseCase(usersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);

    await connection.createQueryRunner().dropTable("statements", true);
    await connection.createQueryRunner().dropTable("users", true);
    await connection.createQueryRunner().dropTable("migrations", true);
    await connection.runMigrations();
  });

  afterAll(() => {
    connection.close();
  });

  it("Should be able do authenticate a user", async () => {
    await createUserUseCase.execute({
      email: "marchetti2@gmail.com",
      password: "123456",
      name: "Mario Luiz",
    });

    const response = await authenticateUserUseCase.execute({
      email: "marchetti2@gmail.com",
      password: "123456",
    });

    expect(response).toHaveProperty("token");
  });

  it("should not be able to authenticate with non existing user", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "johndoe@example.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "marchetti2@gmail.com",
        password: "wrong-password",
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
