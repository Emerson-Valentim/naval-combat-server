import SecretManager from "../secrets";

import _create from "./create";
import _refresh from "./refresh";
import _revoke from "./revoke";
import _verify from "./verify";
import Database from "./ports/database";

export default {
  create: _create(Database, SecretManager),
  refresh: _refresh(Database, SecretManager),
  revoke: _revoke(Database),
  verify: _verify(Database, SecretManager)
};