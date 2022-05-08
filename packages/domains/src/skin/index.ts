import { FileStorage } from "@naval-combat-server/ports";

import _add from "./add";
import _buy from "./buy";
import _get from "./get";
import _getDefault from "./get-default";
import _list from "./list";
import SkinDatabase from "./ports/skin";
import SkinUsageDatabase from "./ports/usage";
import _remove from "./remove";

const SkinFileStorage = new FileStorage("skins");

export default {
  add: _add(SkinDatabase, SkinFileStorage),
  list: _list(SkinDatabase, SkinFileStorage),
  get: _get(SkinDatabase, SkinFileStorage),
  getDefault: _getDefault(SkinDatabase),
  remove: _remove(SkinDatabase,SkinUsageDatabase),
  buy: _buy(SkinUsageDatabase)
};