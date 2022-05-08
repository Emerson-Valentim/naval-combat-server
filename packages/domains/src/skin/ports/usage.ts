import { Database } from "@naval-combat-server/ports";

export interface SkinUsage {
  userId: string;
  skinId: string;
}

const SkinSchema = {
  userId: String,
  skinId: String,
};

const SkinUsage = new Database(process.env.MONGODB_ADDRESS!);

const getEntity = async () => {
  const SkinEntity = await SkinUsage.getEntity("SkinUsage", SkinSchema);

  return SkinEntity;
};

const create = async (input: SkinUsage): Promise<SkinUsage> => {
  const entity = await getEntity();

  const createdUsage: SkinUsage = await entity.create(input);

  return createdUsage;
};

const remove = async (usage: SkinUsage): Promise<void> => {
  const entity = await getEntity();

  await entity.deleteMany(usage);

  return;
};

const list = async (skinId: string): Promise<SkinUsage[]> => {
  const entity = await getEntity();

  return entity.find({ skinId });
};

export default {
  create,
  remove,
  list,
};
