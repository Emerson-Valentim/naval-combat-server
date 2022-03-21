import Database from "./ports/database";
import _list from "./list";
import _create from "./create";
import _registerSocket from "./register-socket";
import _join from "./join";
import _leave from "./leave";

export default {
  create: _create(Database),
  registerSocket: _registerSocket(Database),
  list: _list(Database),
  join: _join(Database),
  leave: _leave(Database)
};
