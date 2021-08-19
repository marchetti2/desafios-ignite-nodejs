import { validate } from "uuid";

import { Statement } from "../../../modules/statements/entities/Statement";
import { User } from "../../../modules/users/entities/User";

describe("Statement Entity", () => {
  let user: User;

  beforeAll(() => {
    user = new User();

    Object.assign(user, {
      name: "Mario Luiz",
      email: "marchetti2@gmail.com",
      password: "123123",
      created_at: new Date(),
      updated_at: new Date(),
    });
  });

  it("should be able to create a deposit", () => {
    const deposit = new Statement();

    Object.assign(deposit, {
      user_id: user.id,
      email: user.email,
      user,
      description: "deposit",
      amount: 4,
      type: "deposit",
      created_at: new Date(),
      updated_at: new Date(),
    });

    expect(deposit).toMatchObject({
      email: "marchetti2@gmail.com",
    });
    expect(validate(String(deposit.id))).toBe(true);
    expect(validate(String(deposit.user_id))).toBe(true);
    expect(user.created_at).toBeInstanceOf(Date);
    expect(user.updated_at).toBeInstanceOf(Date);
  });

  it("should be able to create a withdraw", () => {
    const withdraw = new Statement();

    Object.assign(withdraw, {
      user_id: user.id,
      email: user.email,
      user,
      description: "withdraw",
      amount: 1,
      type: "withdraw",
      created_at: new Date(),
      updated_at: new Date(),
    });

    expect(withdraw).toMatchObject({
      email: "marchetti2@gmail.com",
    });
    expect(validate(String(withdraw.id))).toBe(true);
    expect(validate(String(withdraw.user_id))).toBe(true);
    expect(user.created_at).toBeInstanceOf(Date);
    expect(user.updated_at).toBeInstanceOf(Date);
  });
});
