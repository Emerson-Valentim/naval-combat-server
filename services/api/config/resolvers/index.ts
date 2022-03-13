/* eslint-disable @typescript-eslint/no-unused-vars */
import { accessToken as AccessTokenDomain, user as UserDomain } from "@naval-combat-server/domains";

import { NavalCombatSocket } from "../../ports/notification";

import createUser from "./create-user";
import example from "./example";
import refresh from "./refresh";
import signIn from "./sign-in";

export const resolvers = {
  Query: {
    status: () => true,
  },
  Mutation: {
    example: async (_parent: any, _args: any) => example(NavalCombatSocket, _args.input),
    createUser: async (_parent: any, _args: any) => createUser(UserDomain, _args.input),
    signIn: async (_parent: any, _args: any) => signIn(UserDomain, _args.input),
    refresh: async (_parent: any, _args: any) => refresh(AccessTokenDomain, _args.input)
  },
};
