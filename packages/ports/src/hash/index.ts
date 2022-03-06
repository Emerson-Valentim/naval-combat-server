import upash from "upash";
import pbkdf2 from "@phc/pbkdf2";

import _verify from "./verify";
import _hash from "./hash";

upash.install("@phc/pbkdf2", pbkdf2);

export default {
  verify: _verify(upash),
  hash: _hash(upash)
};