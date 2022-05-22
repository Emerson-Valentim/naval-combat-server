import { IncomingMessage } from "http";

import { ApolloServer as LocalApolloServer, Config } from "apollo-server";
import { ApolloServer as LambdaApolloServer } from "apollo-server-lambda";

import { AuthToken } from "@naval-combat-server/domains/build/src/access-token/@types/auth-token";

import { typeDefs } from "./schema";
import { authenticator, logger } from "./tools/index";
import { resolvers } from "./resolvers/index";

export interface ServerContext {
  accessTokenData?: AuthToken;
}

export default class Server {
  protected static typeDefs = typeDefs;
  protected static resolvers = resolvers;

  public static local() {
    const localServer = new LocalApolloServer(Server.generateConfig());

    localServer.listen().then(({ url }) => {
      // eslint-disable-next-line no-console
      console.log(`🚀  Server ready at ${url}`);
    });
  }

  public static lambda() {
    const lambdaServer = new LambdaApolloServer({
      ...Server.generateConfig(),
      // @ts-expect-error type is not defined correctly
      cors: true,
    });

    return lambdaServer.createHandler();
  }

  protected static generateConfig(): Config<
  LocalApolloServer | LambdaApolloServer
  > {
    return {
      plugins: [logger],
      typeDefs: Server.typeDefs,
      resolvers: Server.resolvers,
      context: async ({
        req,
        event,
      }: {
        req: IncomingMessage;
        event: any;
      }): Promise<ServerContext> => {
        const {
          headers: {
            Authorization: upperCaseAuthorization,
            authorization: lowerCaseAuthorization,
          },
        } = req || event;

        const accessToken =
          lowerCaseAuthorization ??
          (typeof upperCaseAuthorization === "string"
            ? upperCaseAuthorization
            : upperCaseAuthorization?.at(0));

        const authentication = accessToken
          ? await authenticator(accessToken)
          : {};

        return {
          ...authentication,
        };
      },
    };
  }
}
