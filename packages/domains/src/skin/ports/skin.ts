import { Database } from "@naval-combat-server/ports";

export interface Skin {
  id: string;
  name: string;
  images?: ImageFiles;
  sounds?: SoundFiles;
  cost: number;
  status: SkinStatus;
}

export enum SkinStatus {
  DISABLED = "DISABLED",
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
}

export interface File {
  name: string;
  location: string;
}

export enum SkinImageSection {
  SCENARIO = "scenario",
  AVATAR = "avatar",
}

export enum SkinSoundSection {
  VOICE = "voice",
}

export interface ImageFiles {
  [SkinImageSection.AVATAR]: File;
  [SkinImageSection.SCENARIO]: File;
}

export interface SoundFiles {
  [SkinSoundSection.VOICE]: File;
}

export type SkinInput = Omit<Skin, "id" | "images" | "sounds">;

const SkinSchema = {
  name: String,
  images: {
    required: false,
    _id: false,
    type: {
      scenario: {
        name: String,
        location: String,
      },
      avatar: {
        name: String,
        location: String,
      },
    },
  },
  sounds: {
    required: false,
    _id: false,
    type: {
      voice: {
        name: String,
        location: String,
      },
    },
  },
  cost: Number,
  status: String,
};

const Skin = new Database(process.env.MONGODB_ADDRESS!);

const getEntity = async () => {
  const SkinEntity = await Skin.getEntity("Skin", SkinSchema);

  return SkinEntity;
};

const create = async (input: SkinInput): Promise<Skin> => {
  const entity = await getEntity();

  const createdSkin = await entity.create(input);

  return createdSkin;
};

const update = async ({
  id,
  ...input
}: Partial<Pick<Skin, "images" | "name" | "sounds" | "cost" | "status">> & {
  id: string;
}): Promise<Skin> => {
  const entity = await getEntity();

  await entity.findByIdAndUpdate(id, input);

  const room = await entity.findById(id);

  return room;
};

const list = async (): Promise<Skin[]> => {
  const entity = await getEntity();

  const items = await entity.find();

  return items?.map(item => item?.toJSON());
};

const findBy = async (field: "name", value: string): Promise<Skin | null> => {
  const entity = await getEntity();

  const item = await entity.findOne({ [field]: value });

  return item?.toJSON();
};

const findById = async (id: string): Promise<Skin | null> => {
  const entity = await getEntity();

  const item = await entity.findById(id);

  return item?.toJSON();
};

const remove = async (skinId: string): Promise<void> => {
  const entity = await getEntity();

  await entity.findByIdAndDelete(skinId);

  return;
};

export default {
  create,
  update,
  list,
  findBy,
  findById,
  remove,
};
