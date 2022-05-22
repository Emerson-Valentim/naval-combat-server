import { curry, omit } from "ramda";

import DatabasePort, { User } from "./ports/database";

type Input = {
  ids?: string[];
};

const list = async (
  Database: typeof DatabasePort,
  _input?: Input
): Promise<Omit<User, "password">[]> => {

  const users = await Database.list();

  const filteredUsers = users.map(user => omit(["password"], user));

  return filteredUsers as any;
};

export default curry(list);
