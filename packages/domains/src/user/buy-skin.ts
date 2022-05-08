import { curry } from "ramda";

import SkinDomain from "../skin";

import DatabasePort from "./ports/database";

type Input = {
  userId: string;
  skinId: string;
};

const buySkin = async (
  Database: typeof DatabasePort,
  Skin: typeof SkinDomain,
  { userId, skinId }: Input
) => {
  const skin = await Skin.get(skinId);

  if (!skin) {
    throw new Error("Skin not found");
  }

  const user = await Database.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  await Skin.buy({
    userId,
    skinId,
  });

  const availableSkins = user.skin.available;

  if (availableSkins.includes(skinId)) {
    throw new Error("User has already bought this skin");
  }

  await Database.update({
    id: userId,
    skin: {
      ...user.skin,
      available: [...availableSkins, skinId],
    },
  });
};

export default curry(buySkin);
