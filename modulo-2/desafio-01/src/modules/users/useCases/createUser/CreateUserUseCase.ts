import { User } from "../../model/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IRequest {
  name: string;
  email: string;
}

class CreateUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  execute({ email, name }: IRequest): User {

    const checkEmailExists = this.usersRepository.findByEmail(email)

    if (checkEmailExists) {
      throw new Error("Email already exists")
    }

    const user = this.usersRepository.create({email, name})
    return user

  }
}

export { CreateUserUseCase };
