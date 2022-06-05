import { curry } from "ramda";

import DatabasePort, { User } from "./ports/database";

const computeMeta = async (
  Database: typeof DatabasePort,
  user: Omit<User, "password">,
  meta: "wins" | "loses" | "matches",
): Promise<void> => {
  await Database.update({
    id: user.id,
    meta: {
      ...user.meta,
      [meta]: user.meta[meta] + 1
    },
  });

  return;
};

export default curry(computeMeta);
