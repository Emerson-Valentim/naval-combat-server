import { curry } from "ramda";

import SkinDomain from "../skin";

import DatabasePort from "./ports/database";

type Input = {
  userId: string;
  skinId: string;
};

const selectSkin = async (
  Database: typeof DatabasePort,
  Skin: typeof SkinDomain,
  input: Input
) => {
  const user = await Database.findById(input.userId);

  if (!user) {
    throw new Error("User not found");
  }

  const skin = await Skin.get(input.skinId);

  if (!skin) {
    throw new Error("Skin not found");
  }

  await Database.update({
    id: user.id,
    skin: {
      ...user.skin,
      current: input.skinId,
    },
  });

  return;
};

export default curry(selectSkin);
