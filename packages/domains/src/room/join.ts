import { curry } from "ramda";

import BoardDomain from "../board";

import DatabasePort from "./ports/database";

type Input = {
  roomId: string;
  userId: string;
};

const join = async (
  Database: typeof DatabasePort,
  Board: typeof BoardDomain,
  Socket: { emit: (input: { channel: string; message: any }) => void },
  input: Input
) => {
  const room = await Database.findById(input.roomId);

  if (!room) {
    throw new Error("Room not found");
  }

  if (room.players.includes(input.userId)) {
    return;
  }

  if (room?.players?.length >= room.limit) {
    throw new Error("Room is full");
  }

  await Database.update({
    id: input.roomId,
    players: [...room.players, input.userId],
  });

  await Board.addPlayer({
    playerId: input.userId,
    roomId: input.roomId,
  });

  await Socket.emit({
    channel: "server:join:room",
    message: {
      id: input.roomId,
      userId: input.userId,
    },
  });
};

export default curry(join);
