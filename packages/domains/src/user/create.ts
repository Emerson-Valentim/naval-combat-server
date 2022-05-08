import Joi from "joi";
import { curry } from "ramda";

import SkinDomain from "../skin";

import UserDatabasePort, { UserInput } from "./ports/database";

const createSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().min(8).required(),
  password: Joi.string().min(8).required(),
});

const isEmailAvailable = (incomingEmail: string, email: string) =>
  email.toLowerCase() !== incomingEmail.toLocaleLowerCase();

const isUsernameAvailable = (incomingUsername: string, username: string) =>
  username.toLowerCase() !== incomingUsername.toLocaleLowerCase();

const create = async (
  Database: typeof UserDatabasePort,
  Skin: typeof SkinDomain,
  input: UserInput
) => {
  createSchema.validate(input);

  const findByEmail = await Database.findBy("email", input.email.trim());

  if (findByEmail && !isEmailAvailable(input.email, findByEmail.email)) {
    throw new Error("Invalid input");
  }

  const findByUsername = await Database.findBy(
    "username",
    input.username.trim()
  );

  if (
    findByUsername &&
    !isUsernameAvailable(input.username, findByUsername.username)
  ) {
    throw new Error("Username is not available");
  }

  const defaultSkin = await Skin.getDefault({});

  if (!defaultSkin) {
    throw new Error("Default skin is not registered");
  }

  const user = await Database.create({
    ...input,
    skin: {
      current: defaultSkin.id,
      available: [defaultSkin.id],
    },
  });

  return user;
};

export default curry(create);
