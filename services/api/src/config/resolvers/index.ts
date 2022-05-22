/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  accessToken as AccessTokenDomain,
  funds as FundsDomain,
  room as RoomDomain,
  skin as SkinDomain,
  user as UserDomain,
} from "@naval-combat-server/domains";

import { NavalCombatSocket } from "../../ports/notification";
import { ServerContext } from "../server";

import refresh from "./accessToken/refresh";
import approveFunds from "./funds/approve-funds";
import getPendingFunds from "./funds/get-pending-funds";
import requestFunds from "./funds/request-funds";
import createRoom from "./room/create-room";
import getRoom from "./room/get-room";
import getRooms from "./room/get-rooms";
import joinRoom from "./room/join-room";
import addSkin from "./skins/add-skin";
import buySkin from "./skins/buy-skin";
import getSkin from "./skins/get-skin";
import getSkins from "./skins/get-skins";
import removeSkin from "./skins/remove-skin";
import updateSkin from "./skins/update-skin";
import createUser from "./user/create-user";
import getUsers from "./user/get-users";
import profile from "./user/profile";
import signIn from "./user/sign-in";
import signOut from "./user/sign-out";
import updateRoles from "./user/update-roles";
import selectSkin from "./user/select-skin";
import initialSetup from "./setup/initial-setup";

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
    getUsers: (_parent: any, _args: any, { accessTokenData }: ServerContext) =>
      getUsers(UserDomain, accessTokenData),
    getPendingFunds: (
      _parent: any,
      _args: any,
      { accessTokenData }: ServerContext
    ) => getPendingFunds(FundsDomain, accessTokenData),
  },
  Mutation: {
    initialSetup: async (_parent: any, _args: any) =>
      initialSetup(UserDomain, SkinDomain, NavalCombatSocket, _args.input),
    createUser: async (_parent: any, _args: any) =>
      createUser(UserDomain, NavalCombatSocket, _args.input),
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
    ) => addSkin(SkinDomain, accessTokenData, _args.input),
    removeSkin: async (
      _parent: any,
      _args: any,
      { accessTokenData }: ServerContext
    ) =>
      removeSkin(SkinDomain, NavalCombatSocket, accessTokenData, _args.input),
    buySkin: async (
      _parent: any,
      _args: any,
      { accessTokenData }: ServerContext
    ) => buySkin(UserDomain, accessTokenData, _args.input),
    updateSkin: async (
      _parent: any,
      _args: any,
      { accessTokenData }: ServerContext
    ) =>
      updateSkin(SkinDomain, NavalCombatSocket, accessTokenData, _args.input),
    updateRoles: async (
      _parent: any,
      _args: any,
      { accessTokenData }: ServerContext
    ) =>
      updateRoles(UserDomain, NavalCombatSocket, accessTokenData, _args.input),
    approveFunds: async (
      _parent: any,
      _args: any,
      { accessTokenData }: ServerContext
    ) =>
      approveFunds(
        FundsDomain,
        NavalCombatSocket,
        accessTokenData,
        _args.input
      ),
    requestFunds: async (
      _parent: any,
      _args: any,
      { accessTokenData }: ServerContext
    ) =>
      requestFunds(
        FundsDomain,
        NavalCombatSocket,
        accessTokenData,
        _args.input
      ),
    selectSkin: async (
      _parent: any,
      _args: any,
      { accessTokenData }: ServerContext
    ) => selectSkin(UserDomain, accessTokenData, _args.input),
  },
  User: {
    skin: async (
      _parent: any,
      _args: any,
      { accessTokenData }: ServerContext
    ) => getSkin(SkinDomain, UserDomain, accessTokenData),
  },
};
