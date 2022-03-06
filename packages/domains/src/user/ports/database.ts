import { Database, Hash } from "@naval-combat-server/ports";
import { omit } from "ramda";

export interface User {
  email: string;
  username: string;
  password: string;
  meta: {
    wins: number;
    matches: number;
    loses: number;
  };
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
};

const User = new Database(process.env.MONGODB_ADDRESS!);

const getEntity = async () => {
  const UserEntity = await User.getEntity("User", UserSchema);

  return UserEntity;
};

const findBy = async (field: "email" | "username", value: string) => {
  const entity = await getEntity();

  return entity.findOne({ [field]: value });
};

const create = async (user: UserInput) => {
  const entity = await getEntity();

  const newUser: User = {
    email: user.email.trim(),
    username: user.email.trim(),
    password: await Hash.hash(user.password),
    meta: {
      wins: 0,
      loses: 0,
      matches: 0,
    },
  };

  const createdUser = entity.create(newUser);

  return omit(["password"], createdUser);
};

export default {
  findBy,
  create,
};
