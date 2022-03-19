import { Server, Socket } from "socket.io";

import { originDictionary } from "../../commands/dictionary";
import { CLogger } from "../../ports/logger";

export default abstract class BaseSocketHandler<
  EventMapping,
  DependenciesMapping
> {
  private originDictionary = originDictionary;

  protected io!: Server;
  protected socket!: Socket<EventMapping, EventMapping, EventMapping>;
  protected dependencies?: DependenciesMapping;

  constructor(dependencies?: DependenciesMapping) {
    this.dependencies = dependencies;
  }

  public setup(
    io: any,
    socket: Socket<EventMapping, EventMapping, EventMapping>
  ) {
    this.io = io;
    this.socket = socket;

    this.register();
  }

  protected fromBufferToString(message: Buffer) {
    if (!message) return "";

    return Buffer.from(message).toString();
  }

  protected async handleOrigin<T>(command: string, message: Buffer, socket?: Socket
  ): Promise<T | void> {
    const stringifiedMessage = this.fromBufferToString(message);

    const originCommand = this.originDictionary[command];

    try {
      const originResponse = await originCommand.execute(stringifiedMessage, socket);

      return originResponse;
    } catch (error) {
      CLogger.error({
        message: (error as Error).message,
        execution: "origin",
      });

      return;
    }
  }

  protected abstract register(): void;
}
