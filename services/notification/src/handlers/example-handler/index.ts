import { CLogger } from "evs-tools";

import BaseSocketHandler from "../@types/base-socket-handler";

interface ExampleSocketEvents {
  "server:example": (message: any) => void;
}

export default class ExampleSocketHandler extends BaseSocketHandler<
ExampleSocketEvents,
unknown
> {
  protected register(): void {
    this.socket.on("server:example", async (message: Buffer) => {
      const payload = await this.handleOrigin("server", message);

      CLogger.info(payload);
    });
  }
}
