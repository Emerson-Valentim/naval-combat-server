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
    throw new Error("Default skin is not available");
  }

  const images = await authenticateFiles(SkinStorage, skin.images);

  return {
    name: skin.name,
    id: skin.id,
    ...images,
  };
};

export default curry(get);
