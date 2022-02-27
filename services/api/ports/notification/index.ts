import { Managers } from "evs-tools";

Managers.SocketManager.add([
  { host: `${process.env.SOCKET_HOST!}:${process.env.SOCKET_PORT!}`, instance: "naval-combat" },
]);

export default Managers.SocketManager;