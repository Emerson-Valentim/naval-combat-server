import { curry } from "ramda";

import DatabasePort, { RoomStatus, RoomType } from "./ports/database";

type Input = {
  title: string;
  type: RoomType;
  limit: number;
  userId: string;
};

const create = async (
  Database: typeof DatabasePort,
  Socket: { emit: (input: { channel: string; message: any }) => void },
  { userId, ...input }: Input
) => {
  const currentRooms = await Database.findBy({
    owner: userId,
    status: {
      $ne: RoomStatus.DELETED,
    },
  });

  if (currentRooms?.length) {
    for (const currentRoom of currentRooms) {
      await Database.update({
        id: currentRoom.id,
        status: RoomStatus.DELETED,
      });
    }
  }

  const room = {
    owner: userId,
    players: [userId],
    ...input,
  };

  const createdRoom = await Database.create(room);

  await Socket.emit({
    channel: "server:create:room",
    message: {
      id: createdRoom?.id,
      userId
    },
  });

  return createdRoom;
};

export default curry(create);
