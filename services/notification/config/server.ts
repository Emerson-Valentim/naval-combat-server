import { createServer } from "http";

import { Server as SocketServer } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

import { CLogger } from "../ports/logger";
import BaseSocketHandler from "../handlers/@types/base-socket-handler";

export default class Server {
  protected static httpClient = createServer((_, res) => {
    res.end("Server health");
  });
  protected static socketIO = new SocketServer(Server.httpClient, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  public static async start(handlers: BaseSocketHandler<unknown>[]) {
    await Server.adapter();

    Server.register(handlers);

    Server.httpClient.listen(3000, () =>
      CLogger.info(`🥸 Server running on http://localhost:3000/`)
    );
  }

  private static async adapter() {
    const pubClient = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });

    const subClient = pubClient.duplicate();

    await pubClient.connect();
    await subClient.connect();

    Server.socketIO.adapter(createAdapter(pubClient, subClient));
  }

  private static register(handlers: BaseSocketHandler<unknown>[]) {
    Server.socketIO.on("connection", (socket) => {
      handlers.forEach(handler => {
        handler.setup(Server.socketIO, socket);
      });
    });
  }
}
