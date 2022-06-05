import { user as UserDomain, skin as SkinDomain } from "@naval-combat-server/domains";
import { AuthenticationError } from "apollo-server";

type Input = {
  userId?: string;
};

const getPublicProfile = async (user: typeof UserDomain, skin: typeof SkinDomain, input: Input) => {
  if (!input.userId) {
    throw new AuthenticationError("UNAUTHORIZED");
  }

  const profile = await user.get(input.userId, "id");

  const currentSkin = await skin.get(profile.skin.current);

  return {
    id: profile.id,
    username: profile.username,
    meta: profile.meta,
    skin: {
      current: currentSkin
    }
  };
};

export default getPublicProfile;
