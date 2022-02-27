import Server from "./config/server";
import ExampleSocketHandler from "./handlers/example-socket-handler";

Server.start([
  new ExampleSocketHandler()
]);