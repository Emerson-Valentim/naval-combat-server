import { curry } from "ramda";

import { Socket } from "../@types/socket";
import { Roles } from "../access-token/@types/auth-token";

import DatabasePort from "./ports/database";

type Input = {
  userId: string;
  agentId: string;
  roles: Roles[];
};

const updateRoles = async (
  Database: typeof DatabasePort,
  Socket: Socket,
  { userId, agentId, roles }: Input
) => {
  const agent = await Database.findById(agentId);

  if (!agent) {
    throw new Error("Agent not found");
  }

  const isMissingRoleOnAgent = roles.filter(
    (role) => !agent.roles.includes(role)
  ).length;

  if (isMissingRoleOnAgent) {
    throw new Error("User can't provide access");
  }

  const user = await Database.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const newRoles = new Set(["user" as Roles, ...roles]);

  await Database.update({
    id: user.id,
    roles: Array.from(newRoles),
  });

  await Socket.emit({
    channel: "server:user:update",
    message: {
      id: user.id
    }
  });

  return;
};

export default curry(updateRoles);
