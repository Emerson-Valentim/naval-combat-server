import { Database } from "@naval-combat-server/ports";

export enum RoomType {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
}

export enum RoomStatus {
  CREATING = "CREATING",
  CREATED = "CREATED",
  DELETED = "DELETED"
}

export interface Room {
  id: string;
  owner: string;
  title: string;
  type: RoomType;
  players: string[];
  limit: number;
  status: RoomStatus;
}

const RoomSchema = {
  owner: String,
  title: String,
  type: String,
  players: [String],
  limit: Number,
  status: String
};

const Room = new Database(process.env.MONGODB_ADDRESS!);

const getEntity = async () => {
  const RoomEntity = await Room.getEntity("Room", RoomSchema);

  return RoomEntity;
};

const create = async (
  input: Omit<Room, "id" | "status">
): Promise<Room> => {
  const entity = await getEntity();

  const createdRoom: Room = await entity.create({
    ...input,
    status: RoomStatus.CREATING,
  });

  return createdRoom;
};

const update = async ({
  id,
  ...input
}: (Pick<Room, "status"> | Pick<Room, "players"> | Pick<Room, "owner">) & {
  id: string;
}): Promise<Room> => {
  const entity = await getEntity();

  await entity.findByIdAndUpdate(id, input);

  const room = await entity.findById(id);

  return room;
};

const findBy = async (filter: {
  [key: string]: any
}): Promise<Room[]> => {
  const entity = await getEntity();

  return entity.find(filter);
};

const findById = async (id: string): Promise<Room | null> => {
  const entity = await getEntity();

  return entity.findById(id);
};

export default {
  findBy,
  create,
  update,
  findById
};
