import { curry } from "ramda";

import { Socket } from "../@types/socket";

import SkinDatabasePort from "./ports/skin";
import SkinUsageDatabasePort from "./ports/usage";

type Input = {
  skinId: string;
};

const remove = async (
  SkinDatabase: typeof SkinDatabasePort,
  SkinUsageDatabase: typeof SkinUsageDatabasePort,
  Socket: Socket,
  { skinId }: Input
) => {
  const skinUsage = await SkinUsageDatabase.list(skinId);

  if (skinUsage?.length) {
    throw new Error("There is users with skin");
  }

  const skin = await SkinDatabase.findById(skinId);

  if (!skin) {
    throw new Error("Skin not found");
  }

  const isDefaultSkin = skin.name === "default";

  if (isDefaultSkin) {
    throw new Error("Default skin can not be deleted");
  }

  await SkinDatabase.remove(skinId);

  await Socket.emit({
    channel: "server:skin:remove",
    message: {
      id: skin.id,
    },
  });

  return;
};

export default curry(remove);
