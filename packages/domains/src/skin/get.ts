import { FileStorage } from "@naval-combat-server/ports";
import { curry } from "ramda";

import DatabasePort, { ImageFiles, SoundFiles } from "./ports/skin";
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

  if(!skin.images || !skin.sounds) {
    return skin;
  }

  const images = await authenticateFiles<ImageFiles>(SkinStorage, skin.images);

  const sounds = await authenticateFiles<SoundFiles>(SkinStorage, skin.sounds);

  return {
    id: skin.id,
    name: skin.name,
    cost: skin.cost,
    ...images,
    ...sounds
  };
};

export default curry(get);
