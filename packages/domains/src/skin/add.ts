import { FileStorage } from "@naval-combat-server/ports";
import { curry } from "ramda";

import { Socket } from "../@types/socket";

import DatabasePort, {
  ImageFiles, SkinImageSection,
  SkinSoundSection, SkinStatus, SoundFiles
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
  Socket: Socket,
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

  const newSkin = await Database.create({
    name: loweredCasePackageName,
    images,
    sounds,
    cost: input.cost,
    status: SkinStatus.PENDING
  });

  await Socket.emit({
    channel: "server:skin:add",
    message: {
      id: newSkin?.id,
    },
  });

  return newSkin;
};

export default curry(add);