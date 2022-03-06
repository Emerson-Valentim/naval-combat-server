import _create from "./create";
import Database from "./ports/database";

export default {
  create: _create(Database),
};
