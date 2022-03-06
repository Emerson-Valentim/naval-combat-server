import { curry } from "ramda";
import { Hash as HashModule } from "@naval-combat-server/ports";
import Joi from "joi";

import UserDatabasePort from "./ports/database";

type SignInInput = {
  email: string;
  password: string;
}

const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const signIn = async (
  Database: typeof UserDatabasePort,
  Hash: typeof HashModule,
  input: SignInInput
) => {
  signInSchema.validate(input);

  const user = await Database.findBy("email", input.email);

  if (!user) {
    throw new Error("Invalid login");
  }

  const isPasswordValid = await Hash.verify({
    message: input.password,
    hash: user.password
  });

  if(!isPasswordValid) {
    throw new Error("Invalid login");
  }

  return {
    accessToken: "accessToken",
    refreshToken: "refreshToken",
  };
};

export default curry(signIn);