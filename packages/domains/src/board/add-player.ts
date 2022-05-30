import { curry } from "ramda";

import DatabasePort from "./ports/database";

type Input = {
  roomId: string;
  playerId: string;
};

const addPlayer = async (Database: typeof DatabasePort, input: Input) => {
  const board = await Database.findBy({ roomId: input.roomId });

  if (!board) {
    throw new Error("Board not found");
  }

  let playerState = board.state[input.playerId];

  if (!playerState) {
    playerState = Database.buildState({
      size: board.size,
    });
  }

  await Database.update({
    // @ts-expect-error needs to configure mongo driver
    id: board._id,
    state: {
      ...board.state,
      [input.playerId]: playerState,
    },
  });

  return;
};

export default curry(addPlayer);
