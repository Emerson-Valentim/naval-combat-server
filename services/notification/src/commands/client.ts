import { Socket } from "socket.io";

import { authenticator } from "../config/tools";
import { CLogger } from "../ports/logger";

import { Command } from "./command";

export default class Client implements Command {
  public async execute(message: string, socket: Socket): Promise<any | void> {
    try {
      if (!socket.handshake.auth) {
        return;
      }

      await authenticator(socket.handshake.auth.token, socket.id);

      return JSON.parse(message);
    } catch (error: unknown) {
      CLogger.error({
        message: (error as Error).message,
        command: "client",
      });

      return;
    }
  }
}
