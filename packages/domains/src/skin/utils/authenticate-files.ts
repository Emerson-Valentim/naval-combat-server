import { FileStorage } from "@naval-combat-server/ports";

import { Files, SkinSection } from "../ports/skin";

export const authenticateFiles = async (SkinStorage: FileStorage, files: Files) => {
  return Object.entries(files).reduce(
    async (
      obj: Promise<{ [key in SkinSection]: string }>,
      [section, { location, name }]
    ) => {
      const [, extension] = name.split(".");

      const signedUrl = await SkinStorage.get({
        filename: location,
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