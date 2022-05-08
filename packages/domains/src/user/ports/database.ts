import { Database, Hash } from "@naval-combat-server/ports";
import { omit } from "ramda";

import { Roles } from "../../access-token/@types/auth-token";

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  meta: {
    wins: number;
    matches: number;
    loses: number;
  };
  skin: {
    current: string;
    available: string[];
  };
  balance: number;
  socketId?: string;
  roles: Roles[];
}

export type UserInput = Omit<User, "meta">;

const UserSchema = {
  email: String,
  username: String,
  password: String,
  meta: {
    wins: Number,
    matches: Number,
    loses: Number,
  },
  skin: {
    current: String,
    available: [String],
  },
  balance: Number,
  socketId: String,
  roles: [String]
};

const User = new Database(process.env.MONGODB_ADDRESS!);

const getEntity = async () => {
  const UserEntity = await User.getEntity("User", UserSchema);

  return UserEntity;
};

const findBy = async (
  field: "email" | "username" | "socketId",
  value: string
): Promise<User | null> => {
  const entity = await getEntity();

  return entity.findOne({ [field]: value });
};

const findById = async (userId: string): Promise<User | null> => {
  const entity = await getEntity();

  return entity.findById(userId);
};

const create = async (user: UserInput) => {
  const entity = await getEntity();

  const newUser: Omit<User, "id"> = {
    email: user.email.trim(),
    username: user.username.trim(),
    password: await Hash.hash(user.password),
    meta: {
      wins: 0,
      loses: 0,
      matches: 0,
    },
    balance: 0,
    skin: {
      current: user.skin.current,
      available: user.skin.available,
    },
    roles: ["user"],
  };

  const createdUser = await entity.create(newUser);

  return omit(["password"], createdUser);
};

const update = async ({
  id,
  ...input
}: (Pick<User, "socketId"> | Pick<User, "skin" | "balance">) & {
  id: string;
}): Promise<User> => {
  const entity = await getEntity();

  await entity.findByIdAndUpdate(id, input);

  const room = await entity.findById(id);

  return room;
};

export default {
  findBy,
  create,
  update,
  findById,
};
