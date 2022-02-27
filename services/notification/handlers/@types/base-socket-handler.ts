import { Server, Socket } from "socket.io";

export default abstract class BaseSocketHandler<EventMapping> {
  protected io!: Server;
  protected socket!: Socket<EventMapping, EventMapping, EventMapping>;

  public setup(io: any, socket: Socket<EventMapping, EventMapping, EventMapping>) {
    this.io = io;
    this.socket = socket;

    this.register();
  }

  protected abstract register(): void
}