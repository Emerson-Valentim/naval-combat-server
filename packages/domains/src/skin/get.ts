import { FileStorage } from "@naval-combat-server/ports";
import { curry } from "ramda";

import DatabasePort from "./ports/skin";
import { authenticateFiles } from "./utils/authenticate-files";

const get = async (
  Database: typeof DatabasePort,
  SkinStorage: FileStorage,
  id: string
) => {
  const skin = await Database.findById(id);

  if (!skin) {
    throw new Error("Skin not found");
  }

  const images = await authenticateFiles(SkinStorage, skin.images);

  return {
    id: skin.id,
    name: skin.name,
    cost: skin.cost,
    ...images,
  };
};

export default curry(get);
