import { board as BoardDomain } from "@naval-combat-server/domains";
import { AuthToken } from "@naval-combat-server/domains/build/src/access-token/@types/auth-token";
import { AuthenticationError } from "apollo-server";

import { NavalCombatSocket as NavalCombatSocketPort } from "../../../ports/notification";

type Input = {
  roomId: string;
  userId: string;
  x: number;
  y: number;
};

const guess = async (
  NavalCombatSocket: typeof NavalCombatSocketPort,
  board: typeof BoardDomain,
  { x, y, ...input }: Input,
  accessTokenData: AuthToken | undefined
) => {
  if (!accessTokenData) {
    throw new AuthenticationError("UNAUTHORIZED");
  }

  await board.guess(NavalCombatSocket, {
    ...input,
    position: {
      x,
      y,
    },
  });

  return true;
};

export default guess;
