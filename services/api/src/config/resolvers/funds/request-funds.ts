import { funds as FundsDomain } from "@naval-combat-server/domains";
import { AuthToken } from "@naval-combat-server/domains/build/src/access-token/@types/auth-token";
import { AuthenticationError } from "apollo-server";

import { NavalCombatSocket as NavalCombatSocketPort } from "../../../ports/notification";

type Input = {
  value: number;
};

const requestFunds = async (
  funds: typeof FundsDomain,
  NavalCombatSocket: typeof NavalCombatSocketPort,
  accessTokenData: AuthToken | undefined,
  input: Input
) => {
  if (!accessTokenData) {
    throw new AuthenticationError("UNAUTHORIZED");
  }

  await funds.request(NavalCombatSocket, {
    userId: accessTokenData.userId,
    value: input.value,
  });

  return true;
};

export default requestFunds;
