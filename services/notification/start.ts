import {
  room as RoomDomain,
  user as UserDomain,
} from "@naval-combat-server/domains";

import Server from "./src/config/server";
import RoomHandler from "./src/handlers/room";
import UserHandler from "./src/handlers/user";

Server.start([
  {
    handler: RoomHandler,
    dependencies: {
      userDomain: UserDomain,
      roomDomain: RoomDomain
    }
  },
  {
    handler: UserHandler,
  },
]);
