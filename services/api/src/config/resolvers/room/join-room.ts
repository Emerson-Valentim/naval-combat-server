import { ForbiddenError } from "apollo-server";
import { room as RoomDomain } from "@naval-combat-server/domains";
import { AuthToken } from "@naval-combat-server/domains/build/src/access-token/@types/auth-token";

import { NavalCombatSocket as NavalCombatSocketPort } from "../../../ports/notification";

type Input = {
  roomId: string

}

const joinRoom = async (
  NavalCombatSocket: typeof NavalCombatSocketPort,
  room: typeof RoomDomain,
  accessTokenData: AuthToken | undefined,
  input: Input
) => {
  if(!accessTokenData) {
    throw new ForbiddenError("FORBIDDEN");
  }

  await room.join(NavalCombatSocket, {
    ...input,
    userId: accessTokenData.userId
  });

  return true;
};

export default joinRoom;
