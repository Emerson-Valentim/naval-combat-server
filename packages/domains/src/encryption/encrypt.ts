import jwt from "jsonwebtoken";
import { curry } from "ramda";

import SecretManagerDomain from "../secrets";

const encrypt = async (SecretManager: typeof SecretManagerDomain, message: string): Promise<string> => {
  if(!message || typeof message !== "string") {
    throw new Error("Message should be a valid string");
  }

  let secret: string;

  try {
    secret = await SecretManager.get("socket-private-key");
  } catch (error: unknown) {
    throw new Error(`Failed to get secret: ${(error as Error).message}`);
  }

  const encryptedMessage = jwt.sign(message, secret, { algorithm: "HS256" });

  return encryptedMessage;
};

export default curry(encrypt);