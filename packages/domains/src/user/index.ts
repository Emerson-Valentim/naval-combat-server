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

export default {
  create: _create(Database, Skin),
  signIn: _signIn(Database, Hash, AccessToken),
  signOut: _signOut(AccessToken),
  registerSocket: _registerSocket(Database),
  get: _get(Database),
  buySkin: _buySkin(Database, Skin)
};
