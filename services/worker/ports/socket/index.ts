import { Managers } from "evs-tools";

Managers.SocketManager.add([
  { host: `${process.env.SOCKET_HOST!}:${process.env.SOCKET_PORT!}`, instance: "socket-1" },
]);

export default Managers.SocketManager;
