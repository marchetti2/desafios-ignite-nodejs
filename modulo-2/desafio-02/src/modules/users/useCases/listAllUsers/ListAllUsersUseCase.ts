import { User } from "../../model/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IRequest {
  user_id: string;
}

class ListAllUsersUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  execute({ user_id }: IRequest): User[] {

    const userById = this.usersRepository.findById(user_id)

    if(!userById?.admin) {
      throw new Error("User must be an administrator");
    }

    const users = this.usersRepository.list()
    return users

  }
}

export { ListAllUsersUseCase };
