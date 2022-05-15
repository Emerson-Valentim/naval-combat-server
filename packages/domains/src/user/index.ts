import { Hash } from "@naval-combat-server/ports";

import AccessToken from "../access-token";
import Skin from "../skin";

import Database from "./ports/database";
import _get from "./get";
import _create from "./create";
import _signIn from "./sign-in";
import _signOut from "./sign-out";
import _registerSocket from "./register-socket";
import _buySkin from "./buy-skin";
import _updateRoles from "./update-roles";
import _list from "./list";

export default {
  create: _create(Database, Skin),
  signIn: _signIn(Database, Hash, AccessToken),
  signOut: _signOut(AccessToken),
  registerSocket: _registerSocket(Database),
  get: _get(Database),
  buySkin: _buySkin(Database, Skin),
  updateRoles: _updateRoles(Database),
  list: _list(Database)
};
