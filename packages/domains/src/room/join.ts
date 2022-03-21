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
  const rooms = await Database.findBy({ id: input.roomId });

  if (!rooms.length) {
    throw new Error("Room not found");
  }

  const room = rooms[0];

  if (room?.players?.length >= room.limit) {
    throw new Error("Room is full");
  }

  room.players.push(input.userId);

  await Database.update({
    id: input.roomId,
    players: room.players,
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
