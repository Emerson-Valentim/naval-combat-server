import { user } from "@naval-combat-server/domains";

const signIn = async (input: any) => {
  const auth = await user.signIn(input);

  return auth;
};

export default signIn;
