import { Database } from "@naval-combat-server/ports";

export interface Skin {
  id: string;
  name: string;
  images: Files;
  cost: number;
}

export interface File {
  name: string;
  location: string;
}

export enum SkinSection {
  SCENARIO = "scenario",
  AVATAR = "avatar",
}

export interface Files {
  [SkinSection.AVATAR]: File;
  [SkinSection.SCENARIO]: File;
}

export type SkinInput = Omit<Skin, "id">;

const SkinSchema = {
  name: String,
  images: {
    scenario: {
      name: String,
      location: String,
    },
    avatar: {
      name: String,
      location: String,
    },
  },
  cost: Number,
};

const Skin = new Database(process.env.MONGODB_ADDRESS!);

const getEntity = async () => {
  const SkinEntity = await Skin.getEntity("Skin", SkinSchema);

  return SkinEntity;
};

const create = async (input: SkinInput): Promise<Skin> => {
  const entity = await getEntity();

  const createdSkin: Skin = await entity.create(input);

  return createdSkin;
};

const update = async ({
  id,
  ...input
}: Partial<Pick<Skin, "images" | "name">> & {
  id: string;
}): Promise<Skin> => {
  const entity = await getEntity();

  await entity.findByIdAndUpdate(id, input);

  const room = await entity.findById(id);

  return room;
};

const list = async (): Promise<Skin[]> => {
  const entity = await getEntity();

  return entity.find();
};

const findBy = async (field: "name", value: string): Promise<Skin | null> => {
  const entity = await getEntity();

  return entity.findOne({ [field]: value });
};

const findById = async (id: string): Promise<Skin | null> => {
  const entity = await getEntity();

  return entity.findById(id);
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
