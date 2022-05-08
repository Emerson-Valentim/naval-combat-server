import { FileStorage } from "@naval-combat-server/ports";
import { curry } from "ramda";

import DatabasePort, { ImageFiles, SoundFiles } from "./ports/skin";
import { authenticateFiles } from "./utils/authenticate-files";

type Input = {
  ids?: string[];
};

const list = async (
  Database: typeof DatabasePort,
  SkinStorage: FileStorage,
  input?: Input
) => {
  const skins = await Database.list();

  const signedSkins = skins.map(async (skin) => {
    const images = await authenticateFiles<ImageFiles>(SkinStorage, skin.images);

    const sounds = await authenticateFiles<SoundFiles>(SkinStorage, skin.sounds);

    return {
      name: skin.name,
      id: skin.id,
      ...sounds,
      ...images,
    };
  });

  const resolvedSkins = await Promise.all(signedSkins);

  return input?.ids?.length
    ? resolvedSkins.filter(({ id }) => input.ids!.includes(id))
    : resolvedSkins;
};

export default curry(list);
