import Server from "./src/config/server";
import ExampleSocketHandler from "./src/handlers/example-handler";

Server.start([
  new ExampleSocketHandler(),
]);
