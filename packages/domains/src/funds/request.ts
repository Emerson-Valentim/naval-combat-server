import { DateTime } from "luxon";
import { curry } from "ramda";

import { Socket } from "../@types/socket";

import UserDomain from "../user";

import DatabasePort from "./ports/database";

type Input = {
  userId: string;
  value: number;
};

const request = async (
  Database: typeof DatabasePort,
  User: typeof UserDomain,
  Socket: Socket,
  input: Input
) => {
  const user = await User.get(input.userId, "id");

  const fund = await Database.create({
    createdAt: DateTime.now().toMillis(),
    updatedAt: DateTime.now().toMillis(),
    userId: user.id,
    value: input.value,
  });

  await Socket.emit({
    channel: "server:funds:request",
    message: {
      id: fund.id
    }
  });

  return;
};

export default curry(request);
