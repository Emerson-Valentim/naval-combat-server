import { curry } from "ramda";

import DatabasePort, { RoomStatus } from "./ports/database";

type Input = {
  roomId: string;
  userId: string;
};

const leave = async (Database: typeof DatabasePort, input: Input) => {
  const rooms = await Database.findBy({ _id: input.roomId });

  if (!rooms.length) {
    throw new Error("Room not found");
  }

  const room = rooms[0];

  if (!room?.players?.includes(input.userId)) {
    return;
  }

  const currentPlayers = room.players.filter(
    (playerId) => playerId !== input.userId
  );

  const isRoomEmpty = !currentPlayers.length;

  const hasOwnerLeft = !currentPlayers.find(
    (playerId) => playerId === room.owner
  );

  await Database.update({
    id: input.roomId,
    players: currentPlayers,
    status: isRoomEmpty ? RoomStatus.DELETED : room.status,
    owner: hasOwnerLeft ? currentPlayers[0] : room.owner,
  });

  return;
};

export default curry(leave);
