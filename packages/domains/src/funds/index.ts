import UserDomain from "../user";

import Database from "./ports/database";
import _approve from "./approve";
import _getPending from "./get-pending";
import _request from "./request";

export default {
  getPending: _getPending(Database, UserDomain),
  approve: _approve(Database, UserDomain),
  request: _request(Database, UserDomain)
};