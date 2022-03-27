import { encryption } from "@naval-combat-server/domains";

import { CLogger } from "../ports/logger";

import { Command } from "./command";

export default class Server implements Command {

  public async execute<T>(message: string): Promise<T | undefined> {
    try {
      const decryptedMessage = await encryption.decrypt(message);

      return JSON.parse(decryptedMessage) as T;
    } catch (error: unknown) {
      CLogger.error({
        message:(error as Error).message,
        command: "server"
      });

      throw error;
    }
  }
}