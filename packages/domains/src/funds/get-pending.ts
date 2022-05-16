import { curry } from "ramda";

import UserDomain from "../user";

import DatabasePort, { FundsStatus } from "./ports/database";

const getPending = async (
  Database: typeof DatabasePort,
  User: typeof UserDomain,
  _input: any
) => {
  const funds = await Database.findBy({
    status: {
      $ne: FundsStatus.CREDITED,
    },
  });

  const pendingFunds = funds.map(async (fund) => {

    return {
      id: (fund as any)._id,
      username: (await User.get(fund.userId, "id")).username,
      status: fund.status,
      value: fund.value
    };
  });

  const resolvedFunds = await Promise.all(pendingFunds);

  return resolvedFunds;
};

export default curry(getPending);
