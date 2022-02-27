import Server from "./config/server";

export const handle =
  process.env.NODE_ENV === "local"
    ? Server.local()
    : Server.lambda();