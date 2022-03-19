import Database from "./ports/database";
import _create from "./create";
import _registerSocket from "./register-socket";

export default {
  create: _create(Database),
  registerSocket: _registerSocket(Database)
};