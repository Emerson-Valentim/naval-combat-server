import { curry } from "ramda";

import DatabasePort, { User } from "./ports/database";

type Input = {
  user: User,
  value: number,
}

const addBalance = async (
  Database: typeof DatabasePort,
  {user, value}: Input,
): Promise<void> => {

  await Database.update({
    id: user.id,
    balance: user.balance + value
  });

  return;
};

export default curry(addBalance);
