import { CLogger } from "evs-tools";

import BaseSocketHandler from "./@types/base-socket-handler";

type ExampleSocketEvents = {
  "server:example": (message: any) => void,
  "server:example:job:done": (message: any) => void,
}

export default class ExampleSocketHandler extends BaseSocketHandler<ExampleSocketEvents> {
  protected register(): void {
    this.socket.on("server:example", (message) => {
      CLogger.info("Reached event server:example");

      this.io.emit("client:example", message);
    });

    this.socket.on("server:example:job:done", (message) => {
      CLogger.info("Reached event server:example:job:done");

      this.io.emit("client:example:job:done", message);
    });
  }
}
