/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  accessToken as AccessTokenDomain, room as RoomDomain,
  skin as SkinDomain, user as UserDomain
} from "@naval-combat-server/domains";

import { NavalCombatSocket } from "../../ports/notification";
import { ServerContext } from "../server";

import refresh from "./accessToken/refresh";
import createRoom from "./room/create-room";
import getRoom from "./room/get-room";
import getRooms from "./room/get-rooms";
import joinRoom from "./room/join-room";
import addSkin from "./skins/add-skin";
import getSkin from "./skins/get-skin";
import getSkins from "./skins/get-skins";
import removeSkin from "./skins/remove-skin";
import createUser from "./user/create-user";
import profile from "./user/profile";
import signIn from "./user/sign-in";
import signOut from "./user/sign-out";
import buySkin from "./skins/buy-skin";

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
      getRoom(RoomDomain, _args.input, accessTokenData),
    getSkins: (_parent: any, _args: any, { accessTokenData }: ServerContext) =>
      getSkins(SkinDomain, accessTokenData),
  },
  Mutation: {
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
    addSkin: async (
      _parent: any,
      _args: any,
      { accessTokenData }: ServerContext
    ) => addSkin(SkinDomain, accessTokenData, _args.input, ),
    removeSkin: async (
      _parent: any,
      _args: any,
      { accessTokenData }: ServerContext
    ) => removeSkin(SkinDomain, accessTokenData, _args.input, ),
    buySkin: async (
      _parent: any,
      _args: any,
      { accessTokenData }: ServerContext
    ) => buySkin(UserDomain, accessTokenData, _args.input, ),
  },
  User: {
    skin: async (
      _parent: any,
      _args: any,
      { accessTokenData }: ServerContext
    ) => getSkin(SkinDomain, UserDomain, accessTokenData),
  }
};
