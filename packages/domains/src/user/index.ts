import { Hash } from "@naval-combat-server/ports";

import AccessToken from "../access-token";

import _create from "./create";
import _signIn from "./sign-in";
import Database from "./ports/database";
import _signOut from "./sign-out";

export default {
  create: _create(Database),
  signIn: _signIn(Database, Hash, AccessToken),
  signOut: _signOut(AccessToken)
};
