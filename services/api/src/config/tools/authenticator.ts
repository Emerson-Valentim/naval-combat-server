import { curry } from "ramda";
import { accessToken as AccessTokenDomain } from "@naval-combat-server/domains";

const authenticator = async (accessToken: typeof AccessTokenDomain, requestAccessToken: string) => {

  const cleanAccessToken = requestAccessToken.replace("Bearer ", "");

  const accessTokenData = await accessToken.verify(cleanAccessToken);

  return { accessTokenData };
};

export default curry(authenticator);
