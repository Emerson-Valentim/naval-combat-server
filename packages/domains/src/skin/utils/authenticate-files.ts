import { FileStorage } from "@naval-combat-server/ports";

import { ImageFiles, SoundFiles } from "../ports/skin";

export const authenticateFiles = async <T extends ImageFiles | SoundFiles>(
  SkinStorage: FileStorage,
  files: T
) => {
  return Object.entries(files).reduce(
    async (
      obj: Promise<{ [key: string]: string }>,
      [section, { location, name }]
    ) => {
      const [, extension] = name.split(".");

      const signedUrl = await SkinStorage.get({
        location,
        contentType: `image/${extension}`,
      });

      return {
        ...(await obj),
        [section]: signedUrl,
      };
    },
    {} as any
  );
};
