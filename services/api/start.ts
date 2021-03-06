import Server from "./src/config/server";

export const handle =
  process.env.APP_ENV === "local"
    ? Server.local()
    : Server.lambda();