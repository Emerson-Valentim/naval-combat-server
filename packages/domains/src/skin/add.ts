import { curry } from "ramda";

import DatabasePort, { SkinStatus } from "./ports/skin";

type Input = {
  packageName: string;
  cost: number;
};

const add = async (
  Database: typeof DatabasePort,
  input: Input
) => {
  const loweredCasePackageName = input.packageName.toLowerCase();

  const previousSkin = await Database.findBy("name", loweredCasePackageName);

  if (previousSkin && previousSkin.name === loweredCasePackageName) {
    throw new Error("There is already a package with this name");
  }

  const newSkin = await Database.create({
    name: loweredCasePackageName,
    cost: input.cost,
    status: SkinStatus.PENDING
  });

  return newSkin;
};

export default curry(add);
