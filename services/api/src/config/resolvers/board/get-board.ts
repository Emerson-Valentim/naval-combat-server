import { board as BoardDomain } from "@naval-combat-server/domains";
import { AuthToken } from "@naval-combat-server/domains/build/src/access-token/@types/auth-token";
import { AuthenticationError } from "apollo-server";

const getBoard = async (
  board: typeof BoardDomain,
  roomId: string,
  accessTokenData: AuthToken | undefined
) => {
  if (!accessTokenData) {
    throw new AuthenticationError("UNAUTHORIZED");
  }

  const currentBoard = await board.get({
    id: roomId,
    userId: accessTokenData.userId,
  });

  return currentBoard;
};

export default getBoard;
