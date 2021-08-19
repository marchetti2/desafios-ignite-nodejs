import request from "supertest";

import { Connection, createConnection } from "typeorm";

import { v4 as uuid } from "uuid";

import { app } from "../app";
import { Statement } from "../modules/statements/entities/Statement";
import { User } from "../modules/users/entities/User";

describe("All routes", () => {
  let connection: Connection;
  let user: User;
  let token: string;
  let deposit: Statement;

  beforeAll(async () => {
    connection = await createConnection();

    await connection.createQueryRunner().dropTable("statements", true);
    await connection.createQueryRunner().dropTable("users", true);
    await connection.createQueryRunner().dropTable("migrations", true);

    await connection.runMigrations();
  });

  it("should be able to create a new user", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "Mario Luiz",
        password: "123123",
        email: "marchetti2@gmail.com",
      })
      .expect(201);
  });

  it("should not be able to create a new user with same email from another", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "Mario Luiz",
        password: "123123",
        email: "marchetti2@gmail.com",
      })
      .expect(400);
  });

  it("should be able to authenticate a user", async () => {
    const response = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "marchetti2@gmail.com",
        password: "123123",
      })
      .expect(200);

    user = response.body.user;
    token = response.body.token;

    expect(response.body).toHaveProperty("token");
  });

  it("should not be able to authenticate with non existing user", async () => {
    await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "johndoe@example.com",
        password: "123456",
      })
      .expect(401);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "marchetti2@gmail.com",
        password: "wrong-password",
      })
      .expect(401);
  });

  it("should be able to show the profile", async () => {
    const response = await request(app)
      .get("/api/v1/profile")
      .set("Authorization", `Bearer ${String(token)}`)
      .expect(200);

    expect(response.body).toMatchObject(user);
  });

  it("should not be able to show the profile if token is missing", async () => {
    await request(app).get("/api/v1/profile").expect(401);
  });

  it("Should be able to make a deposit", async () => {
    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .set("Authorization", `Bearer ${String(token)}`)
      .send({
        amount: 50,
        description: "wages",
      })
      .expect(201);

    deposit = response.body;

    expect(response.body.type).toBe("deposit");
  });

  it("Should be able to make a withdraw", async () => {
    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .set("Authorization", `Bearer ${String(token)}`)
      .send({
        amount: 40,
        description: "rent",
      })
      .expect(201);

    expect(response.body.type).toBe("withdraw");
  });

  it("Should not be able to make a withdraw if there are not enough funds", async () => {
    await request(app)
      .post("/api/v1/statements/withdraw")
      .set("Authorization", `Bearer ${String(token)}`)
      .send({
        amount: 40,
        description: "rent",
      })
      .expect(400);
  });

  it("Should not be able to make statement if token is missing", async () => {
    await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 40,
        description: "rent",
      })
      .expect(401);
  });

  it("Should be able to get a user balance", async () => {
    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set("Authorization", `Bearer ${String(token)}`)
      .expect(200);

    expect(response.body).toHaveProperty("balance");
    expect(response.body.statement).toHaveLength(2);
    expect(response.body.balance).toBe(10);
  });

  it("Should not be able to get a user balance if token is missing", async () => {
    await request(app).get("/api/v1/statements/balance").expect(401);
  });

  it("Should be able to get a user statement operation", async () => {
    const response = await request(app)
      .get(`/api/v1/statements/${deposit.id}`)
      .set("Authorization", `Bearer ${String(token)}`)
      .expect(200);

    expect(response.body.user_id).toBe(user.id);
  });

  it("Should not be able to get a user statement operation if token is missing", async () => {
    await request(app).get(`/api/v1/statements/${deposit.id}`).expect(401);
  });

  it("Should not be able to get a non existing statement operation", async () => {
    await request(app)
      .get(`/api/v1/statements/${uuid()}`)
      .set("Authorization", `Bearer ${String(token)}`)
      .expect(404);
  });
});
