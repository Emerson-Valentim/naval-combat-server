import { ForbiddenError } from "apollo-server";
import { room as RoomDomain } from "@naval-combat-server/domains";
import { RoomType } from "@naval-combat-server/domains/build/src/room/ports/database";
import { AuthToken } from "@naval-combat-server/domains/build/src/access-token/@types/auth-token";

import { NavalCombatSocket as NavalCombatSocketPort } from "../../../ports/notification";

type Input = {
  limit: number
  type: RoomType
  title: string

}

const createRoom = async (
  NavalCombatSocket: typeof NavalCombatSocketPort,
  room: typeof RoomDomain,
  accessTokenData: AuthToken | undefined,
  input: Input
) => {
  if(!accessTokenData) {
    throw new ForbiddenError("FORBIDDEN");
  }

  const createdRoom = await room.create(NavalCombatSocket, {
    ...input,
    userId: accessTokenData.userId
  });

  return createdRoom;

};

export default createRoom;
