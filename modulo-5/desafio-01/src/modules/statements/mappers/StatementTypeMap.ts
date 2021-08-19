import { Statement } from "../entities/Statement";

export class StatementTypeMap {
  static toDTO(statement:Statement) {

    const {user_id, ...rest} = statement
    const parsedStatement = Object.assign(rest, {sender_id: user_id})
    return parsedStatement

  }
}
