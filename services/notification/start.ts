import { room as RoomDomain } from "@naval-combat-server/domains";

import Server from "./src/config/server";
import ExampleSocketHandler from "./src/handlers/example-handler";
import RoomHandler from "./src/handlers/room";

Server.start([
  new ExampleSocketHandler(),
  new RoomHandler({
    roomDomain: RoomDomain
  })
]);
