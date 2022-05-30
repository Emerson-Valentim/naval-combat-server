import { curry } from "ramda";

import { Socket } from "../@types/socket";
import { Room } from "../room/ports/database";

import DatabasePort, { BoardStatus, TileStatus } from "./ports/database";
import { parseObject } from "./utils/parse-object";

type Input = {
  room: Room;
  playerId: string;
  positions: { row: number; column: number }[];
};

const individualSetup = async (
  Database: typeof DatabasePort,
  Socket: Socket,
  input: Input
) => {
  const board = await Database.findBy({ roomId: input.room.id });

  if (!board) {
    throw new Error("Board not found");
  }

  if (input.room.players.length < 2) {
    throw new Error("Room is not ready");
  }

  const isPlayerTurn = board.currentPlayer === input.playerId;

  if(!isPlayerTurn) {
    throw new Error("Player should wait a turn");
  }

  const playerState = board.state[input.playerId];

  if (!playerState) {
    throw new Error("Player is not in the board");
  }

  const isBoardAlreadySetup =
    playerState.status === BoardStatus.DONE ||
    board.status === BoardStatus.DONE;

  if (isBoardAlreadySetup) {
    throw new Error("Board is already done");
  }

  input.positions.map(parseObject).forEach(([row, column]) => {
    playerState.positions[row][column] = TileStatus.FILLED;
  });

  playerState.status = BoardStatus.DONE;

  const isMissingSetup = Object.values(board.state).filter(
    ({ status }) => status === BoardStatus.PENDING
  ).length;

  await Database.update({
    // @ts-expect-error needs to configure mongo driver
    id: board._id,
    state: board.state,
    status: isMissingSetup ? BoardStatus.PENDING : BoardStatus.DONE,
    currentPlayer: input.room.players.find((id) => id !== board.currentPlayer),
  });

  await Socket.emit({
    channel: "server:setup:room",
    message: {
      roomId: board.roomId,
    },
  });

  return;
};

export default curry(individualSetup);
