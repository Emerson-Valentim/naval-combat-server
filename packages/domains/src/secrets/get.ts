import { curry } from "ramda";

const get = (key: string) => {
  const secret =
    process.env.APP_ENV === "local" ? `${key}_secret` : `${key}_sm_secret`;

  if (!secret) {
    throw new Error("Secret is not available");
  }

  return secret;
};

export default curry(get);
