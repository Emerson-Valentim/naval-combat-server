import { curry } from "ramda";

import DatabasePort from "./ports/database";

type Input = {
  roomId: string;
  size: number;
  currentPlayer: string;
}

const create = async (Database: typeof DatabasePort, input: Input) => {
  if (input.size <= 0) {
    throw new Error("Size cant be lower or equal zero");
  }

  await Database.create(input);

  return;
};

export default curry(create);
