import { Managers } from "evs-tools";

Managers.RedisManager.add([{
  instance: "redis-1",
  host: process.env.REDIS_HOST!,
  port: +process.env.REDIS_PORT!,
}]);

Managers.WorkerManager.add([{
  queueName: "example",
  redis: Managers.RedisManager,
  redisName: "redis-1",
}]);

export default Managers.WorkerManager;