import { Hash } from "@naval-combat-server/ports";

import AccessToken from "../access-token";

import _create from "./create";
import _signIn from "./sign-in";
import Database from "./ports/database";

export default {
  create: _create(Database),
  signIn: _signIn(Database, Hash, AccessToken)
};
