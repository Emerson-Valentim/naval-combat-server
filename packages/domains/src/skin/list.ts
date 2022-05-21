import { FileStorage } from "@naval-combat-server/ports";
import { curry } from "ramda";

import DatabasePort, { ImageFiles, Skin, SkinStatus, SoundFiles } from "./ports/skin";
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

  const signedSkins = skins.reduce(async (arr, skin) => {
    const resolvedArr = await arr;

    const isActive = skin.status === SkinStatus.ACTIVE;

    if(isActive && !!skin.images && !!skin.sounds) {
      const images = await authenticateFiles<ImageFiles>(SkinStorage, skin.images);

      const sounds = await authenticateFiles<SoundFiles>(SkinStorage, skin.sounds);

      resolvedArr.push({
        name: skin.name,
        id: skin.id,
        cost: skin.cost,
        status: skin.status,
        ...sounds,
        ...images,
      });
    }

    return resolvedArr;
  }, Promise.resolve([] as Skin[]));

  const resolvedSkins = await signedSkins;

  return input?.ids?.length
    ? resolvedSkins.filter(({ id }) => input.ids!.includes(id))
    : resolvedSkins;
};

export default curry(list);
