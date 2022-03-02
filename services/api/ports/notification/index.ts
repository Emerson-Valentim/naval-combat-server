import { Managers } from "evs-tools";

import SocketHandler from "./handler";

Managers.SocketManager.add([
  { host: `${process.env.SOCKET_HOST!}:${process.env.SOCKET_PORT!}`, instance: "naval-combat" },
]);

export const NavalCombatSocket = new SocketHandler(Managers.SocketManager.get("naval-combat"));