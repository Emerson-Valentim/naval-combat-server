import { DateTime } from "luxon";
import { curry } from "ramda";

import UserDomain from "../user";

import DatabasePort, { FundsStatus } from "./ports/database";

type Input = {
  id: string;
  agentId: string;
};

const approve = async (
  Database: typeof DatabasePort,
  User: typeof UserDomain,
  input: Input
) => {
  const agent = await User.get(input.agentId, "id");

  const fund = await Database.findById(input.id);

  if (!fund) {
    throw new Error("Fund not found");
  }

  const isFundPending = fund.status === FundsStatus.PENDING;

  if(!isFundPending) {
    throw new Error("Only PENDING funds can be approved");
  }

  await Database.update({
    id: input.id,
    agentId: agent.id,
    updatedAt: DateTime.now().toMillis(),
    status: FundsStatus.CREDITED,
  });

  await User.addBalance({
    user: await User.get(fund.userId, "id"),
    value: fund.value
  });

  return;
};

export default curry(approve);
