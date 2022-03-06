import Joi from "joi";
import { curry } from "ramda";

import UserDatabasePort, { UserInput } from "./ports/database";

const createSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().min(8).required(),
  password: Joi.string().min(8).required(),
});

const create = async (Database: typeof UserDatabasePort, input: UserInput) => {
  createSchema.validate(input);

  const user = await Database.create(input);

  return user;
};

export default curry(create);