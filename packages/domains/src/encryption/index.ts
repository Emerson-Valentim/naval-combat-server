import SecretManager from "../secrets";

import _encrypt from "./encrypt";
import _decrypt from "./decrypt";

export default {
  encrypt: _encrypt(SecretManager),
  decrypt: _decrypt(SecretManager),
};