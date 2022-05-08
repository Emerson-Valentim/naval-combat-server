import { curry } from "ramda";
import { FileStorage } from "@naval-combat-server/ports";

import DatabasePort, {
  ImageFiles,
  SoundFiles,
  SkinImageSection,
  SkinSoundSection,
} from "./ports/skin";

type File = {
  filename: string;
  base64: string;
};

type Input = {
  packageName: string;
  images: {
    [key in SkinImageSection]: File;
  };
  sounds: {
    [key in SkinSoundSection]: File;
  };
  cost: number;
};

const saveFiles = async <T extends ImageFiles | SoundFiles>(
  SkinStorage: FileStorage,
  files: { [key: string]: File },
  packageName: string,
  {
    allowedExtensions,
    type,
  }: {
    allowedExtensions: string[];
    type: "image" | "audio";
  }
) => {
  return Object.entries(files).reduce(
    async (obj: Promise<T>, [section, { filename, base64 }]) => {
      const [, extension] = filename.split(".");

      if (!allowedExtensions.includes(extension)) {
        throw new Error("Extension is not allowed");
      }

      const storageKey = await SkinStorage.add({
        filename: `${packageName}/${filename}`,
        base64,
        contentType: `${type}/${extension}`,
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
      allowedExtensions: ["png"],
      type: "image",
    }
  );

  const sounds = await saveFiles<SoundFiles>(
    SkinStorage,
    input.sounds,
    loweredCasePackageName,
    {
      allowedExtensions: ["mp4", "mp3"],
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
