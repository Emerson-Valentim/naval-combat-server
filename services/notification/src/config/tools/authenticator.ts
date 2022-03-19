import { curry } from "ramda";
import {
  accessToken as AccessTokenDomain,
  user as UserDomain,
} from "@naval-combat-server/domains";

const authenticator = async (
  accessToken: typeof AccessTokenDomain,
  user: typeof UserDomain,
  requestAccessToken: string,
  socketId: string
) => {
  const cleanAccessToken = requestAccessToken.replace("Bearer ", "");

  const accessTokenData = await accessToken.verify(cleanAccessToken);

  await user.registerSocket({
    id: accessTokenData.userId,
    socketId,
  });
};

export default curry(authenticator);
