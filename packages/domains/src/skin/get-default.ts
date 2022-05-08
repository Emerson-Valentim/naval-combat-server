import { curry } from "ramda";

import DatabasePort from "./ports/skin";

const getDefault = async (
  Database: typeof DatabasePort,
  _input: any = {}
) => {
  const skin = await Database.findBy("name", "default");

  if(!skin) {
    throw new Error("Default skin is not available");
  }

  return skin;
};

export default curry(getDefault);
