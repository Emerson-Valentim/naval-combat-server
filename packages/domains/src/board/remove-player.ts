import { curry } from "ramda";

import DatabasePort, { BoardStatus } from "./ports/database";

type Input = {
  roomId: string;
  playerId: string;
};

const removePlayer = async (Database: typeof DatabasePort, input: Input) => {
  const board = await Database.findBy({ roomId: input.roomId });

  if (!board) {
    throw new Error("Board not found");
  }

  const { [input.playerId]: _removedPlayer, ...state } = board.state;

  await Database.update({
    // @ts-expect-error needs to configure mongo driver
    id: board._id,
    state: state,
    status: BoardStatus.PENDING,
  });

  return;
};

export default curry(removePlayer);
