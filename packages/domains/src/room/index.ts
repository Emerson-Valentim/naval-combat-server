import Board from "../board";

import _create from "./create";
import _get from "./get";
import _join from "./join";
import _leave from "./leave";
import _list from "./list";
import Database from "./ports/database";
import _registerSocket from "./register-socket";

export default {
  create: _create(Database, Board),
  registerSocket: _registerSocket(Database),
  list: _list(Database),
  join: _join(Database, Board),
  leave: _leave(Database, Board),
  get: _get(Database),
};
