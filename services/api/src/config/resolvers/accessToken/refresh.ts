import { accessToken as AccessTokenDomain } from "@naval-combat-server/domains";
import { ForbiddenError } from "apollo-server";
import { curry } from "ramda";

type RefreshTokenInput = {
  refreshToken: string
};

const refresh = async (accessToken: typeof AccessTokenDomain, input: RefreshTokenInput) => {
  try {
    const tokens = await accessToken.refresh(input.refreshToken);

    return tokens;
  } catch (error) {
    throw new ForbiddenError("FORBIDDEN");
  }
};

export default curry(refresh);