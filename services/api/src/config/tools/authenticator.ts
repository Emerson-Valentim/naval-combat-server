import { curry } from "ramda";
import { accessToken as AccessTokenDomain } from "@naval-combat-server/domains";
import { AuthenticationError } from "apollo-server";

const authenticator = async (
  accessToken: typeof AccessTokenDomain,
  requestAccessToken: string
) => {
  const cleanAccessToken = requestAccessToken.replace("Bearer ", "");

  try {
    const accessTokenData = await accessToken.verify(cleanAccessToken);

    return { accessTokenData };
  } catch (error) {
    throw new AuthenticationError("UNAUTHORIZED");
  }
};

export default curry(authenticator);
