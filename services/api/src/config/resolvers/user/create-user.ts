import { user as UserDomain } from "@naval-combat-server/domains";

import { NavalCombatSocket as NavalCombatSocketPort } from "../../../ports/notification";

const createUser = async (
  user: typeof UserDomain,
  NavalCombatSocket: typeof NavalCombatSocketPort,
  input: any
) => {
  const newUser = await user.create(NavalCombatSocket, input);

  return newUser;
};

export default createUser;
