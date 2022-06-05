import { ForbiddenError } from "apollo-server";
import { board as BoardDomain, room as RoomDomain } from "@naval-combat-server/domains";
import { AuthToken } from "@naval-combat-server/domains/build/src/access-token/@types/auth-token";

import { NavalCombatSocket as NavalCombatSocketPort } from "../../../ports/notification";

type Input = {
  roomId: string;
  positions: { row: number; column: number }[];
};

const individualSetup = async (
  NavalCombatSocket: typeof NavalCombatSocketPort,
  board: typeof BoardDomain,
  room: typeof RoomDomain,
  accessTokenData: AuthToken | undefined,
  input: Input
) => {
  if (!accessTokenData) {
    throw new ForbiddenError("FORBIDDEN");
  }

  const incomingRoom = await room.get(input.roomId);

  await board.individualSetup(NavalCombatSocket, {
    room: incomingRoom,
    playerId: accessTokenData.userId,
    positions: input.positions,
  });

  return true;
};

export default individualSetup;
