import { room as RoomDomain } from "@naval-combat-server/domains";

const getRooms = async (room: typeof RoomDomain) => {
  const rooms = await room.list({});

  return rooms;
};

export default getRooms;
