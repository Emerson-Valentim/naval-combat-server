import { FileStorage } from "@naval-combat-server/ports";

import SkinDatabase from "./ports/skin";
import SkinUsageDatabase from "./ports/usage";
import _add from "./add";
import _buy from "./buy";
import _get from "./get";
import _list from "./list";
import _remove from "./remove";
import _update from "./update";
import _getDefault from "./get-default";

const SkinFileStorage = new FileStorage(process.env.SKIN_BUCKET);

export default {
  add: _add(SkinDatabase, SkinFileStorage),
  list: _list(SkinDatabase, SkinFileStorage),
  get: _get(SkinDatabase, SkinFileStorage),
  getDefault: _getDefault(SkinDatabase),
  remove: _remove(SkinDatabase,SkinUsageDatabase),
  buy: _buy(SkinUsageDatabase),
  update: _update(SkinDatabase, SkinFileStorage)
};