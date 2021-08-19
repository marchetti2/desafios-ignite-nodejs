import { Connection, createConnection, QueryFailedError } from "typeorm";
import { v4 as uuid } from "uuid";

import { User } from "../../../modules/users/entities/User";

import { UsersRepository } from "../../../modules/users/repositories/UsersRepository";

describe("UsersRepository", () => {
  let connection: Connection;
  let user: User;

  let usersRepository: UsersRepository;

  beforeAll(async () => {
    connection = await createConnection();

    usersRepository = new UsersRepository();

    await connection.createQueryRunner().dropTable("statements", true);
    await connection.createQueryRunner().dropTable("users", true);
    await connection.createQueryRunner().dropTable("migrations", true);

    await connection.runMigrations();
  });

  afterAll(() => {
    connection.close();
  });

  it("Should be able to create a new user", async () => {
    user = await usersRepository.create({
      name: "Mario Luiz",
      email: "marchetti2@gmail.com",
      password: "123123123",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user with same email from another", async () => {
    await expect(
      usersRepository.create({
        name: "Mario Luiz",
        email: "marchetti2@gmail.com",
        password: "123123123",
      })
    ).rejects.toBeInstanceOf(QueryFailedError);
  });

  it("Should be able to find a user by email", async () => {
    const response = await usersRepository.findByEmail(user.email);

    expect(response?.email).toBe("marchetti2@gmail.com");
  });

  it("should not be able to show the profile from non-existing user", async () => {
    expect(
      await usersRepository.findByEmail("wrong@gmail.com")
    ).toBe(undefined);
  });

  it("Should be able to find a user by id", async () => {
    const response = await usersRepository.findById(String(user.id));

    expect(response?.name).toBe("Mario Luiz");
    expect(response?.email).toBe("marchetti2@gmail.com");
  });

  it("should not be able to show the profile from non-existing user", async () => {
    expect( await usersRepository.findById(uuid())).toBe(
      undefined
    );
  });
});
