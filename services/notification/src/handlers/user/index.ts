import { CLogger } from "evs-tools";
import {
  user as UserDomain,
} from "@naval-combat-server/domains";

import BaseSocketHandler from "../@types/base-socket-handler";

interface UserSocketEvents {
  "client:signIn": () => void;
}

export default class UserHandler extends BaseSocketHandler<
UserSocketEvents,
{
  userDomain: typeof UserDomain;
}
> {
  protected register(): void {
    this.socket.on("client:signIn", async () => {
      CLogger.info({
        channel: "client:signIn",
        date: new Date().getTime(),
      });

      await this.handleOrigin<{ id: string; userId: string }>(
        "client",
        Buffer.from("{}")
      );

      return;
    });

  }
}
