import { curry } from "ramda";

import DatabasePort, { Board, TileStatus } from "./ports/database";

const get = async (
  Database: typeof DatabasePort,
  {
    id,
    userId,
  }: {
    id: string;
    userId?: string;
  }
): Promise<Board> => {
  const board = await Database.findBy({ roomId: id });

  if (!board) {
    throw new Error("Board not found");
  }

  if (userId) {
    board.state = Object.entries(board.state).reduce((obj, [id, value]) => {
      if (id === userId) {
        return obj;
      }

      board.state[id] = {
        ...value,
        positions: value.positions.map((position) =>
          Object.values(position).reduce((obj, value, index) => {
            return {
              ...obj,
              [index]: value === TileStatus.FILLED ? TileStatus.EMPTY : value,
            };
          }, {})
        ),
      };

      return obj;
    }, board.state);
  }

  return board;
};

export default curry(get);
