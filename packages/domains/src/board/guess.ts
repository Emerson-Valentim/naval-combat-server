import { curry } from "ramda";

import { Socket } from "../@types/socket";

import DatabasePort, { TileStatus } from "./ports/database";

type Input = {
  roomId: string;
  userId: string;
  position: { x: number; y: number };
};

const guess = async (
  Database: typeof DatabasePort,
  Socket: Socket,
  input: Input
) => {
  const board = await Database.findBy({ roomId: input.roomId });

  if (board.currentPlayer === input.userId) {
    throw new Error("It is not player turn");
  }

  const enemyBoard = board.state[input.userId];

  const boardRow = enemyBoard.positions[input.position.x];

  const tile = boardRow[input.position.y];

  if (![TileStatus.FILLED, TileStatus.EMPTY].includes(tile)) {
    throw new Error("This tile can't be updated");
  }

  const updatedTileStatus =
    tile === TileStatus.FILLED ? TileStatus.DESTROYED : TileStatus.MISSED;

  boardRow[input.position.y] = updatedTileStatus;

  await Database.update({
    // @ts-expect-error needs to configure mongo driver
    id: board._id,
    currentPlayer: input.userId,
    state: {
      ...board.state,
      [input.userId]: enemyBoard,
    },
  });

  const availableTiles = enemyBoard.positions.reduce((obj, position) => {
    return obj.concat(Object.values(position));
  }, [] as any);

  let isGameOver = false;

  if (!availableTiles.includes(TileStatus.FILLED)) {
    isGameOver = true;
  }

  await Socket.emit({
    channel: "server:guess:room",
    message: {
      roomId: board.roomId,
      isGameOver,
      loser: input.userId,
      winner: board.currentPlayer,
    },
  });

  return;
};

export default curry(guess);
