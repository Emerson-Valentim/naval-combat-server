import { curry, omit } from "ramda";

import DatabasePort, { User } from "./ports/database";

const get = async (
  Database: typeof DatabasePort,
  id: string,
  field: "socket" | "id"
): Promise<Omit<User, "password">> => {

  const user =
    field === "id"
      ? await Database.findById(id)
      : await Database.findBy("socketId", id);

  if (!user) {
    throw new Error("User not found");
  }

  const filteredUser = omit(["password"], user);

  return filteredUser;
};

export default curry(get);
