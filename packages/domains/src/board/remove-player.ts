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

  const isBoardRunning = board.status === BoardStatus.DONE;

  const newBoard = await Database.update({
    id: board.id,
    state: state,
    status: isBoardRunning ? BoardStatus.FINISHED : BoardStatus.PENDING,
  });

  return newBoard;
};

export default curry(removePlayer);
