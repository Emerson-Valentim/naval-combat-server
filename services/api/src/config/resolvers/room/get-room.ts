import { room as RoomDomain } from "@naval-combat-server/domains";
import { AuthToken } from "@naval-combat-server/domains/build/src/access-token/@types/auth-token";
import { ForbiddenError } from "apollo-server";

type Input = {
  roomId: string;
};

const getRoom = async (
  room: typeof RoomDomain,
  input: Input,
  accessTokenData: AuthToken | undefined
) => {
  if (!accessTokenData?.userId) {
    throw new ForbiddenError("FORBIDDEN");
  }

  const filteredRoom = await room.get(input.roomId);

  const isUserOnRoom = filteredRoom.players.includes(accessTokenData?.userId);

  if (!isUserOnRoom) {
    throw new ForbiddenError("FORBIDDEN");
  }

  return filteredRoom;
};

export default getRoom;
