import { curry } from "ramda";

import { Roles } from "../access-token/@types/auth-token";

import DatabasePort from "./ports/database";

type Input = {
  userId: string,
  agentId: string,
  roles: Roles[]
}

const updateRoles = async(Database: typeof DatabasePort, {userId, agentId, roles}: Input) => {
  const agent = await Database.findById(agentId);

  if(!agent) {
    throw new Error("");
  }

  const isMissingRoleOnAgent = roles.filter((role) => !agent.roles.includes(role)).length;

  if(isMissingRoleOnAgent) {
    throw new Error("");
  }

  const user = await Database.findById(userId);

  if(!user) {
    throw new Error("");
  }

  const newRoles = new Set(["user" as Roles, ...roles]);

  await Database.update({
    id: user.id,
    roles: Array.from(newRoles)
  });

  return;
};

export default curry(updateRoles);
