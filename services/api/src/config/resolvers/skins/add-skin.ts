import { skin as SkinDomain } from "@naval-combat-server/domains";
import { AuthToken } from "@naval-combat-server/domains/build/src/access-token/@types/auth-token";

type File = {
  filename: string;
  base64: string;
};

type Input = {
  packageName: string
  cost: number;
  images: {
    scenario: File;
    avatar: File;
  };
};

const addSkin = async (
  skin: typeof SkinDomain,
  _accessTokenData: AuthToken | undefined,
  input: Input,
) => {
  // if(!_accessTokenData) {
  //   throw new ForbiddenError("");
  // }

  await skin.add(input);

  return true;
};

export default addSkin;
