import { FileStorage } from "@naval-combat-server/ports";

import { ImageFiles, SoundFiles } from "../ports/skin";

export type IncomingFile = {
  filename: string;
  base64: string;
};

const allowedExtensions = {
  image: ["png", "jpeg"],
  audio: ["mp3", "mp4"],
};

export const saveFiles = async <
  T extends Partial<ImageFiles> | Partial<SoundFiles>
>(
  SkinStorage: FileStorage,
  files: { [key: string]: IncomingFile },
  packageName: string,
  {
    type,
  }: {
    type: "image" | "audio";
  }
) => {
  return Object.entries(files).reduce(
    async (obj: Promise<T>, [section, { filename, base64 }]) => {
      const [, extension] = filename.split(".");

      if (!allowedExtensions[type].includes(extension)) {
        throw new Error("Extension is not allowed");
      }

      const storageKey = await SkinStorage.add({
        location: `${packageName}/${filename}`,
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
