import {
  skin as SkinDomain,
  user as UserDomain,
} from "@naval-combat-server/domains";
import { SkinStatus } from "@naval-combat-server/domains/build/src/skin/ports/skin";

import { NavalCombatSocket as NavalCombatSocketPort } from "../../../ports/notification";

import skinData from "./skin.json";

const initialSetup = async (
  user: typeof UserDomain,
  skin: typeof SkinDomain,
  NavalCombatSocket: typeof NavalCombatSocketPort,
  { user: userInput }: any
) => {
  const users = await user.list({});

  if (users.length) {
    throw new Error("Setup already made");
  }

  try {
    await skin.getDefault({});

    throw new Error("Default skin is already created");
  } catch (error: any) {
    const isDefaultSkinNotAvailable =
      error.message === "Default skin is not available";

    if (!isDefaultSkinNotAvailable) {
      throw error;
    }
  }

  await skin.add(NavalCombatSocket, {
    packageName: "default",
    cost: 0,
    status: SkinStatus.ACTIVE,
    ...skinData
  });

  await user.create(NavalCombatSocket, userInput);

  return true;
};

export default initialSetup;
