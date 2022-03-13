import Server from "./src/config/server";

export const handle =
  process.env.NODE_ENV === "local"
    ? Server.local()
    : Server.lambda();