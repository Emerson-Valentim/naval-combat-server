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
  SHIP_1 = "ship1",
  SHIP_2 = "ship2",
  SHIP_3 = "ship3",
  SHIP_4 = "ship4",
  SHIP_5 = "ship5",
}

export enum SkinSoundSection {
  VOICE_YES = "voiceYes",
  VOICE_NO = "voiceNo",
}

export interface ImageFiles {
  [SkinImageSection.AVATAR]: File;
  [SkinImageSection.SCENARIO]: File;
  [SkinImageSection.SHIP_1]: File;
  [SkinImageSection.SHIP_2]: File;
  [SkinImageSection.SHIP_3]: File;
  [SkinImageSection.SHIP_4]: File;
  [SkinImageSection.SHIP_5]: File;
}

export interface SoundFiles {
  [SkinSoundSection.VOICE_NO]: File;
  [SkinSoundSection.VOICE_YES]: File;
}

export type SkinInput = Omit<Skin, "id">;

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
      ship1: {
        name: String,
        location: String,
      },
      ship2: {
        name: String,
        location: String,
      },
      ship3: {
        name: String,
        location: String,
      },
      ship4: {
        name: String,
        location: String,
      },
      ship5: {
        name: String,
        location: String,
      }
    },
  },
  sounds: {
    required: false,
    _id: false,
    type: {
      voiceYes: {
        name: String,
        location: String,
      },
      voiceNo: {
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
