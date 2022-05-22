import {
  skin as SkinDomain, user as UserDomain
} from "@naval-combat-server/domains";
import { SkinStatus } from "@naval-combat-server/domains/build/src/skin/ports/skin";

import { NavalCombatSocket as NavalCombatSocketPort } from "../../../ports/notification";

const initialSetup = async (
  user: typeof UserDomain,
  skin: typeof SkinDomain,
  NavalCombatSocket: typeof NavalCombatSocketPort,
  { user: userInput, skin: skinInput }: any
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

  const newSkin = await skin.add( {
    packageName: "default",
    cost: 0,
  });

  await skin.update(NavalCombatSocket, {
    id: newSkin.id,
    status: SkinStatus.ACTIVE,
    ...skinInput,
  });

  await user.create(NavalCombatSocket, userInput);

  return true;
};

export default initialSetup;
