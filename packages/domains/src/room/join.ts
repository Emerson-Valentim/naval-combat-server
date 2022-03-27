import { curry } from "ramda";

import DatabasePort from "./ports/database";

type Input = {
  roomId: string;
  userId: string;
};

const join = async (
  Database: typeof DatabasePort,
  Socket: { emit: (input: { channel: string; message: any }) => void },
  input: Input
) => {
  const room = await Database.findById(input.roomId);

  if (!room) {
    throw new Error("Room not found");
  }

  if(room.players.includes(input.userId)) {
    return;
  }

  if (room?.players?.length >= room.limit) {
    throw new Error("Room is full");
  }

  await Database.update({
    id: input.roomId,
    players: [...room.players, input.userId],
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
