import { curry } from "ramda";

import DatabasePort, { SkinStatus } from "./ports/skin";

const getDefault = async (
  Database: typeof DatabasePort,
  _input?: any
) => {
  const skin = await Database.findBy("name", "default");

  if(!skin || skin.status !== SkinStatus.ACTIVE) {
    throw new Error("Default skin is not available");
  }

  return skin;
};

export default curry(getDefault);
