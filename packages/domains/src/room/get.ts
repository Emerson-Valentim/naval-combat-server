import { curry } from "ramda";

import DatabasePort, { Room } from "./ports/database";

const get = async (
  Database: typeof DatabasePort,
  id: string
): Promise<Room> => {

  const room = await Database.findById(id);

  if (!room) {
    throw new Error("Room not found");
  }

  return room;
};

export default curry(get);
