import { omit } from "ramda";
import { Database } from "@naval-combat-server/ports";

export interface AccessToken {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

const AccessTokenSchema = {
  accessToken: String,
  refreshToken: String,
  userId: String,
};

const AccessToken = new Database(process.env.MONGODB_ADDRESS!);

const getEntity = async () => {
  const AccessTokenEntity = await AccessToken.getEntity(
    "AccessToken",
    AccessTokenSchema
  );

  return AccessTokenEntity;
};

const findBy = async (
  userId: string,
) => {
  const entity = await getEntity();

  return entity.findOne({ userId });
};

const create = async (input: AccessToken): Promise<Omit<AccessToken, "userId">> => {
  const entity = await getEntity();

  const createdAccessToken: AccessToken = await entity.create(input);

  return omit(["userId", "id"], createdAccessToken);
};

const remove = async (userId: string) => {
  const entity = await getEntity();

  await entity.deleteMany({ userId: userId });

  return;
};

export default {
  create,
  findBy,
  remove
};
