import { accessToken as AccessTokenDomain } from "@naval-combat-server/domains";
import { curry } from "ramda";

const authenticator = async (accessToken: typeof AccessTokenDomain, requestAccessToken: string) => {
  const cleanAccessToken = requestAccessToken.replace("Bearer ", "");

  const accessTokenData = await accessToken.verify(cleanAccessToken);

  return { accessTokenData };
};

export default curry(authenticator);
