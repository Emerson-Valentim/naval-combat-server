import { CLogger } from "../ports/logger";

import { Command } from "./command";

export default class Client implements Command {

  public async execute(message: string) {
    try {
      CLogger.info("Client command");

      return JSON.parse(message);
    } catch (error: unknown) {
      CLogger.error({
        message:(error as Error).message,
        command: "client"
      });

      return;
    }
  }
}