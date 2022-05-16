import { curry } from "ramda";

import { Socket } from "../@types/socket";

import DatabasePort, { User } from "./ports/database";

type Input = {
  user: User;
  value: number;
};

const addBalance = async (
  Database: typeof DatabasePort,
  Socket: Socket,
  { user, value }: Input
): Promise<void> => {
  await Database.update({
    id: user.id,
    balance: user.balance + value,
  });

  await Socket.emit({
    channel: "server:user:update",
    message: {
      id: user.id,
    },
  });

  return;
};

export default curry(addBalance);
