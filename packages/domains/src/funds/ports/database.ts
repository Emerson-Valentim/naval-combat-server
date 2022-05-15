import { Database } from "@naval-combat-server/ports";

export enum FundsStatus {
  PENDING = "PENDING",
  CREDITED = "CREDITED"
}

export interface Funds {
  id: string;
  userId: string
  agentId?: string
  value: number
  createdAt: number
  updatedAt: number
  status: FundsStatus
}

const RoomSchema = {
  id: String,
  userId: String,
  agentId: String,
  value: Number,
  createdAt: Number,
  updatedAt: Number,
  status: String
};

const Funds = new Database(process.env.MONGODB_ADDRESS!);

const getEntity = async () => {
  const RoomEntity = await Funds.getEntity("Funds", RoomSchema);

  return RoomEntity;
};

const create = async (
  input: Omit<Funds, "id" | "status" | "agentId">
): Promise<Funds> => {
  const entity = await getEntity();

  const createdRoom: Funds = await entity.create({
    ...input,
    status: FundsStatus.PENDING,
    agentId: ""
  });

  return createdRoom;
};

const update = async ({
  id,
  ...input
}: (Pick<Funds, "status" | "updatedAt" | "agentId">) & {
  id: string;
}): Promise<Funds> => {
  const entity = await getEntity();

  await entity.findByIdAndUpdate(id, input);

  const room = await entity.findById(id);

  return room;
};

const findBy = async (filter: {
  [key: string]: any
}): Promise<Funds[]> => {
  const entity = await getEntity();

  const funds = await entity.find(filter);

  return funds;
};

const findById = async (id: string): Promise<Funds | null> => {
  const entity = await getEntity();

  return entity.findById(id);
};

export default {
  findBy,
  create,
  update,
  findById
};
