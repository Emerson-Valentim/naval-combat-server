import { curry } from "ramda";

import DatabasePort, { Room, RoomStatus } from "./ports/database";

const end = async (
  Database: typeof DatabasePort,
  id: string
): Promise<Room> => {
  const room = await Database.findById(id);

  if (!room) {
    throw new Error("Room not found");
  }

  await Database.update({
    id: room.id,
    status: RoomStatus.DELETED,
  });

  return room;
};

export default curry(end);
