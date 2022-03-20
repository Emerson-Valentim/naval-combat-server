import { curry } from "ramda";

import DatabasePort, { RoomStatus, RoomType } from "./ports/database";

const list = async (Database: typeof DatabasePort, _?: any) => {
  const rooms = await Database.findBy({
    status: {
      $ne: RoomStatus.DELETED,
    },
    type: {
      $ne: RoomType.PRIVATE,
    },
  });

  return rooms;
};

export default curry(list);
