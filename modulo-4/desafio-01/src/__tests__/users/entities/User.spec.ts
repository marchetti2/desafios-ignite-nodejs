import { User } from "../../../modules/users/entities/User";

import { validate } from "uuid";

describe("User Entity", () => {
  it("should be able to create a user", () => {
    const user = new User();

    Object.assign(user, {
      name: "Mario Luiz",
      email: "marchetti2@gmail.com",
      password: "123123123",
      created_at: new Date(),
      updated_at: new Date(),
    });

    expect(user).toMatchObject({
      name: "Mario Luiz",
      email: "marchetti2@gmail.com",
    });

    expect(validate(String(user.id))).toBe(true);
    expect(user.created_at).toBeInstanceOf(Date);
    expect(user.updated_at).toBeInstanceOf(Date);
  });
});
