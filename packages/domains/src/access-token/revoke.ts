import { curry } from "ramda";

import AccessTokenDatabasePort from "./ports/database";

const revoke = async (
  Database: typeof AccessTokenDatabasePort,
  userId: string
) => {
  await Database.remove(userId);

  return;
};

export default curry(revoke);