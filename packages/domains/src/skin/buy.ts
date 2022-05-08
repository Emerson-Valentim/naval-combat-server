import { curry } from "ramda";

import SkinUsageDatabasePort from "./ports/usage";

type Input = {
  userId: string;
  skinId: string;
};

const buy = async (
  SkinUsageDatabase: typeof SkinUsageDatabasePort,
  { userId, skinId }: Input
) => {
  await SkinUsageDatabase.create({
    userId,
    skinId
  });

  return;
};

export default curry(buy);
