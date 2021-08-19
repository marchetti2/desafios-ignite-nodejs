import { User } from "../../model/User";
import { IUsersRepository, ICreateUserDTO } from "../IUsersRepository";

class UsersRepository implements IUsersRepository {
  private users: User[];

  private static INSTANCE: UsersRepository;

  private constructor() {
    this.users = [];
  }

  public static getInstance(): UsersRepository {
    if (!UsersRepository.INSTANCE) {
      UsersRepository.INSTANCE = new UsersRepository();
    }

    return UsersRepository.INSTANCE;
  }

  create({ name, email }: ICreateUserDTO): User {

    const user = new User(name, email);
    this.users.push(user)

    return user;
  }

  findById(id: string): User | undefined {

    const userById = this.users.find(user => user.id === id)

    return userById
  }

  findByEmail(email: string): User | undefined {

    const userByEmail = this.users.find(user => user.email === email)

    return userByEmail

  }

  turnAdmin(receivedUser: User): User {

    const userIndex = this.users.findIndex(user => user.id === receivedUser.id)

    const updatedUser = {
      ...receivedUser,
      admin: true
    }

    this.users[userIndex] = updatedUser

    return updatedUser

  }

  list(): User[] {
    return this.users
  }
}

export { UsersRepository };
