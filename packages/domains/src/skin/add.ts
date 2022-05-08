import { curry } from "ramda";
import { FileStorage } from "@naval-combat-server/ports";

import DatabasePort, { Files, SkinSection } from "./ports/skin";

type File = {
  filename: string;
  base64: string;
};

type Input = {
  packageName: string;
  images: {
    [key in SkinSection]: File;
  };
  cost: number;
};

const add = async (
  Database: typeof DatabasePort,
  SkinStorage: FileStorage,
  input: Input
) => {
  const loweredCasePackageName = input.packageName.toLowerCase();

  const previousSkin = await Database.findBy("name", loweredCasePackageName);

  if (previousSkin && previousSkin.name === loweredCasePackageName) {
    throw new Error("There is already a package with this name");
  }

  const files = await Object.entries(input.images).reduce(
    async (obj: Promise<Files>, [section, { filename, base64 }]) => {
      const [, extension] = filename.split(".");

      if (!["png"].includes(extension)) {
        throw new Error("Extension is not allowed");
      }

      const storageKey = await SkinStorage.add({
        filename: `${loweredCasePackageName}/${filename}`,
        base64: base64.replace(/^data:image\/\w+;base64,/, ""),
        contentType: `image/${extension}`,
      });

      return {
        ...(await obj),
        [section]: {
          location: storageKey,
          name: filename,
        },
      };
    },
    {} as any
  );

  await Database.create({
    name: loweredCasePackageName,
    images: files,
    cost: input.cost
  });
};

export default curry(add);
