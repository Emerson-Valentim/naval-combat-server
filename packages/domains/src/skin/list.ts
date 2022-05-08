import { FileStorage } from "@naval-combat-server/ports";
import { curry } from "ramda";

import DatabasePort from "./ports/skin";
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
    const files = await authenticateFiles(SkinStorage, skin.images);

    return {
      name: skin.name,
      id: skin.id,
      ...files,
    };
  });

  const resolvedSkins = await Promise.all(signedSkins);

  return input?.ids?.length
    ? resolvedSkins.filter(({ id }) => input.ids!.includes(id))
    : resolvedSkins;
};

export default curry(list);
