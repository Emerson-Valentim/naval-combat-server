import { Database } from "@naval-combat-server/ports";

export interface User {
  email: string
  userName: string
  password: string
  meta: {
    wins: number,
    matches: number,
    loses: number
  }
}

export type UserInput = Omit<User, "meta">

const UserSchema = {
  email: String,
  userName: String,
  password: String,
  meta: {
    wins: Number,
    matches: Number,
    loses: Number
  }
};

const User = new Database(process.env.MONGODB_ADDRESS!);

const getEntity = async () => {
  const UserEntity = await User.getEntity("User", UserSchema);

  return UserEntity;
};

const findById = async (id: string) => {
  const entity = await getEntity();

  return entity.findById(id);
};

const create = async (user: UserInput) => {
  const entity = await getEntity();

  const newUser: User = {
    ...user,
    meta: {
      wins: 0,
      loses: 0,
      matches: 0
    }
  };

  return entity.create(newUser);
};

export default {
  findById,
  create
};