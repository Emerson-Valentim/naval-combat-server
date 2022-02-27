import { Managers } from "evs-tools";

import { RedisInstances } from "./@types/instances";

Managers.RedisManager.add([{
  instance: RedisInstances["REDIS-1"],
  host: process.env.REDIS_HOST!,
  port: +process.env.REDIS_PORT!,
}]);

export default Managers.RedisManager;
