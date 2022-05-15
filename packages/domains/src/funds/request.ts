import { DateTime } from "luxon";
import { curry } from "ramda";

import UserDomain from "../user";

import DatabasePort from "./ports/database";

type Input = {
  userId: string;
  value: number;
};

const request = async (
  Database: typeof DatabasePort,
  User: typeof UserDomain,
  input: Input
) => {
  const user = await User.get(input.userId, "id");

  await Database.create({
    createdAt: DateTime.now().toMillis(),
    updatedAt: DateTime.now().toMillis(),
    userId: user.id,
    value: input.value,
  });

  return;
};

export default curry(request);
