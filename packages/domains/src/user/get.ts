import { curry, omit } from "ramda";

import DatabasePort, { User } from "./ports/database";

const get = async (
  Database: typeof DatabasePort,
  userId: string
): Promise<Omit<User, "password">> => {
  const user = await Database.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const filteredUser = omit(["password"], user);

  return filteredUser;
};

export default curry(get);
