/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  accessToken as AccessTokenDomain,
  user as UserDomain,
  room as RoomDomain,
} from "@naval-combat-server/domains";

import { NavalCombatSocket } from "../../ports/notification";

import { ServerContext } from "../server";

import signIn from "./user/sign-in";
import createUser from "./user/create-user";
import profile from "./user/profile";
import signOut from "./user/sign-out";
import createRoom from "./room/create-room";
import getRooms from "./room/get-rooms";
import joinRoom from "./room/join-room";
import _getRoom from "./room/get-room";
import refresh from "./accessToken/refresh";
import example from "./example";

export const resolvers = {
  Query: {
    status: () => true,
    getRooms: async (_parent: any, _args: any) => getRooms(RoomDomain),
    profile: async (
      _parent: any,
      _args: any,
      { accessTokenData }: ServerContext
    ) =>
      profile(UserDomain, {
        userId: accessTokenData?.userId,
      }),
    getRoom: (_parent: any, _args: any, { accessTokenData }: ServerContext) =>
      _getRoom(RoomDomain, _args.input, accessTokenData),
  },
  Mutation: {
    example: async (_parent: any, _args: any) =>
      example(NavalCombatSocket, _args.input),
    createUser: async (_parent: any, _args: any) =>
      createUser(UserDomain, _args.input),
    signIn: async (_parent: any, _args: any) => signIn(UserDomain, _args.input),
    signOut: async (
      _parent: any,
      _args: any,
      { accessTokenData }: ServerContext
    ) => signOut(UserDomain, accessTokenData),
    refresh: async (_parent: any, _args: any) =>
      refresh(AccessTokenDomain, _args.input),
    createRoom: async (
      _parent: any,
      _args: any,
      { accessTokenData }: ServerContext
    ) =>
      createRoom(NavalCombatSocket, RoomDomain, accessTokenData, _args.input),
    joinRoom: async (
      _parent: any,
      _args: any,
      { accessTokenData }: ServerContext
    ) => joinRoom(NavalCombatSocket, RoomDomain, accessTokenData, _args.input),
  },
};
