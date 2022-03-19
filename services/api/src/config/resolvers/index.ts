/* eslint-disable @typescript-eslint/no-unused-vars */
import { accessToken as AccessTokenDomain, user as UserDomain, room as RoomDomain } from "@naval-combat-server/domains";

import { NavalCombatSocket } from "../../ports/notification";

import { ServerContext } from "../server";

import createUser from "./user/create-user";
import example from "./example";
import refresh from "./accessToken/refresh";
import signIn from "./user/sign-in";
import signOut from "./user/sign-out";
import createRoom from "./room/createRoom";

export const resolvers = {
  Query: {
    status: () => true,
  },
  Mutation: {
    example: async (_parent: any, _args: any) => example(NavalCombatSocket, _args.input),
    createUser: async (_parent: any, _args: any) => createUser(UserDomain, _args.input),
    signIn: async (_parent: any, _args: any) => signIn(UserDomain, _args.input),
    signOut: async(_parent: any, _args: any, { accessTokenData }: ServerContext) => signOut(UserDomain, accessTokenData),
    refresh: async (_parent: any, _args: any) => refresh(AccessTokenDomain, _args.input),
    createRoom: async (_parent: any, _args: any, { accessTokenData}: ServerContext) => createRoom(NavalCombatSocket, RoomDomain, accessTokenData, _args.input)
  },
};
