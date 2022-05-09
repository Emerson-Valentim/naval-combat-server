import { FileStorage } from "@naval-combat-server/ports";
import { curry } from "ramda";

import DatabasePort, {
  ImageFiles, SkinImageSection,
  SkinSoundSection, SoundFiles
} from "./ports/skin";
import { IncomingFile, saveFiles } from "./utils/save-files";

type Input = {
  packageName: string;
  images: {
    [key in SkinImageSection]: IncomingFile;
  };
  sounds: {
    [key in SkinSoundSection]: IncomingFile;
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

  const images = await saveFiles<ImageFiles>(
    SkinStorage,
    input.images,
    loweredCasePackageName,
    {
      type: "image",
    }
  );

  const sounds = await saveFiles<SoundFiles>(
    SkinStorage,
    input.sounds,
    loweredCasePackageName,
    {
      type: "audio",
    }
  );

  await Database.create({
    name: loweredCasePackageName,
    images,
    sounds,
    cost: input.cost,
  });
};

export default curry(add);
