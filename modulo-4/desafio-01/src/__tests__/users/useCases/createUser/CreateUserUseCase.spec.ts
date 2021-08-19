import { Connection, createConnection } from "typeorm";
import { UsersRepository } from "../../../../modules/users/repositories/UsersRepository";
import { CreateUserUseCase } from "../../../../modules/users/useCases/createUser/CreateUserUseCase";
import { CreateUserError } from "../../../../modules/users/useCases/createUser/CreateUserError";

describe("CreateUserUseCase", () => {
  let connection: Connection;

  let usersRepository: UsersRepository;

  let createUserUseCase: CreateUserUseCase;

  beforeAll(async () => {
    connection = await createConnection();

    usersRepository = new UsersRepository();

    createUserUseCase = new CreateUserUseCase(usersRepository);

    await connection.createQueryRunner().dropTable("statements", true);
    await connection.createQueryRunner().dropTable("users", true);
    await connection.createQueryRunner().dropTable("migrations", true);
    await connection.runMigrations();
  });

  afterAll(() => {
    connection.close();
  });

  it("Should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      email: "marchetti2@gmail.com",
      password: "123456",
      name: "Mario Luiz",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to craete a new user with same email from another", async () => {
    await expect(
      createUserUseCase.execute({
        email: "marchetti2@gmail.com",
        password: "123456",
        name: "Mario Luiz",
      })
    ).rejects.toBeInstanceOf(CreateUserError);
  });
});
