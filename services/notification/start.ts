import {
  room as RoomDomain,
  user as UserDomain,
} from "@naval-combat-server/domains";

import Server from "./src/config/server";
import ExampleSocketHandler from "./src/handlers/example-handler";
import RoomHandler from "./src/handlers/room";
import UserHandler from "./src/handlers/user";

Server.start([
  new ExampleSocketHandler(),
  new RoomHandler({
    roomDomain: RoomDomain,
    userDomain: UserDomain,
  }),
  new UserHandler({
    userDomain: UserDomain,
  })
]);
