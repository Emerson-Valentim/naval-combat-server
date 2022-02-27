import { CLogger } from "evs-tools";

import { Workers } from "./handlers/@types/workers";

import Socket from "./ports/socket";
import SocketHandler from "./ports/socket/handler";
import RedisManager from "./ports/redis";
import { RedisInstances } from "./ports/redis/@types/instances";
import { BaseWorkerHandler } from "./handlers/@types/base-worker-handler";
import ExampleWorkerHandler from "./handlers/example-worker-handler";

const socketHandler = new SocketHandler(Socket.get("socket-1"));

const workers: Workers = {
  example: {
    workerHandler: new ExampleWorkerHandler(
      { queueName: "example" },
      RedisManager.get(RedisInstances["REDIS-1"])
    ),
    dependencies: {
      socket: socketHandler
    }
  }
};

function start(workers: Workers) {
  CLogger.info("Initialization started");

  const availableWorkers = Object.values(workers);

  availableWorkers.forEach(
    ({ workerHandler, dependencies }) => {
      (workerHandler as BaseWorkerHandler<any, any, any>).register(dependencies);
    }
  );
}

start(workers);
