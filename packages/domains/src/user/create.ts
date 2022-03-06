import { curry } from "ramda";

import UserDatabasePort, {UserInput} from "./ports/database";

const create = async (Database: typeof UserDatabasePort, input: UserInput) => {
  const user = await Database.create(input);

  return user;
};

export default curry(create);