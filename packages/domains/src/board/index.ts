import _create from "./create";
import _addPlayer from "./add-player";
import _removePlayer from "./remove-player";
import _individualSetup from "./individual-setup";
import _get from "./get";
import Database from "./ports/database";

export default {
  create: _create(Database),
  addPlayer: _addPlayer(Database),
  individualSetup: _individualSetup(Database),
  removePlayer: _removePlayer(Database),
  get: _get(Database)
};