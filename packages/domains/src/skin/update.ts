import { FileStorage } from "@naval-combat-server/ports";

import { curry } from "ramda";

import { Socket } from "../@types/socket";

import DatabasePort, {
  ImageFiles,
  SkinImageSection,
  SkinSoundSection,
  SkinStatus,
  SoundFiles,
} from "./ports/skin";
import { IncomingFile, saveFiles } from "./utils/save-files";

type Input = {
  id: string;
  status?: SkinStatus;
  name?: string;
  cost?: number;
  images?: {
    [key in SkinImageSection]?: IncomingFile;
  };
  sounds?: {
    [key in SkinSoundSection]?: IncomingFile;
  };
};

const cleanOldFiles = async <
  T extends Partial<ImageFiles> | Partial<SoundFiles>
>(
  SkinStorage: FileStorage,
  { currentFiles, previousFiles }: { currentFiles: T; previousFiles: T }
) => {
  const currentKeys = Object.values(currentFiles).map(
    ({ location }) => location
  );

  const previousKeys = Object.values(previousFiles).map(
    ({ location }) => location
  );

  const promises = previousKeys.map(async (location) => {
    if (!currentKeys.includes(location)) {
      await SkinStorage.remove({ location });
    }
  });

  await Promise.all(promises);
};

const update = async (
  Database: typeof DatabasePort,
  SkinStorage: FileStorage,
  Socket: Socket,
  input: Input
) => {
  const skin = await Database.findById(input.id);

  if (!skin) {
    throw new Error("Skin not found");
  }

  if (skin.name === "default" && input.name && skin.name !== input.name) {
    throw new Error("Default skin name is not updatable");
  }

  const updatedName = (input.name || skin.name).toLocaleLowerCase();

  let updatedSounds = skin.sounds;
  let updatedImages = skin.images;

  if (input.sounds) {
    const sounds = await saveFiles<SoundFiles>(
      SkinStorage,
      input.sounds,
      updatedName,
      {
        type: "audio",
      }
    );

    updatedSounds = {
      ...skin.sounds,
      ...sounds,
    };

    if (skin.sounds) {
      await cleanOldFiles(SkinStorage, {
        currentFiles: updatedSounds,
        previousFiles: skin.sounds,
      });
    }
  }

  if (input.images) {
    const images = await saveFiles<ImageFiles>(
      SkinStorage,
      input.images,
      updatedName,
      {
        type: "image",
      }
    );

    updatedImages = {
      ...skin.images,
      ...images,
    };

    if (skin.images) {
      await cleanOldFiles(SkinStorage, {
        currentFiles: updatedImages,
        previousFiles: skin.images,
      });
    }
  }

  const currentCost = input.cost ?? skin.cost;

  const currentStatus = input.status ?? skin.status;

  await Database.update({
    id: input.id,
    sounds: updatedSounds,
    images: updatedImages,
    cost: currentCost,
    name: updatedName,
    status: currentStatus,
  });

  if (currentStatus === SkinStatus.ACTIVE) {
    await Socket.emit({
      channel: "server:skin:update",
      message: {
        id: input.id,
      },
    });
  }

  return;
};

export default curry(update);
