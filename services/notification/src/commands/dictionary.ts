import Client from "./client";
import Server from "./server";
import { Command } from "./command";

export const originDictionary: { [key: string]: Command } = {
  server: Server.prototype,
  client: Client.prototype,
};
