import { curry } from "ramda";

import DatabasePort, { RoomStatus } from "./ports/database";

type Input = {
  roomId: string;
  userId: string;
};

const leave = async (Database: typeof DatabasePort, input: Input) => {
  const rooms = await Database.findBy({ id: input.roomId });

  if (!rooms.length) {
    throw new Error("Room not found");
  }

  const room = rooms[0];

  if (room?.players?.includes(input.userId)) {
    return;
  }

  const currentPlayers = room.players.filter(
    (playerId) => playerId !== input.userId
  );

  const isNewOwner =
    currentPlayers.length === 1 && room.owner !== currentPlayers[0];

  const isRoomEmpty = room.players.length;

  await Database.update({
    id: input.roomId,
    players: currentPlayers,
    status: isRoomEmpty ? RoomStatus.DELETED : room.status,
    owner: isNewOwner ? room.players[0] : room.owner,
  });

  return;
};

export default curry(leave);
