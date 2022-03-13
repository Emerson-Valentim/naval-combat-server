import { IncomingMessage } from 'http';

import { ApolloServer as LocalApolloServer, Config } from 'apollo-server';
import { ApolloServer as LambdaApolloServer } from 'apollo-server-lambda';

import { AuthToken } from '@naval-combat-server/domains/build/src/access-token/@types/auth-token';

import { typeDefs } from "./schema";
import {authenticator} from './tools/index';
import { resolvers } from "./resolvers/index";

export interface ServerContext {
  accessTokenData?: AuthToken
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
    const lambdaServer = new LambdaApolloServer(Server.generateConfig());

    return lambdaServer.createHandler();
  }

  protected static generateConfig(): Config<LocalApolloServer | LambdaApolloServer> {
    return {
      typeDefs: Server.typeDefs,
      resolvers: Server.resolvers,
      context: async ({ req }: { req: IncomingMessage}): Promise<ServerContext> => {
        const { headers: { authorization: accessToken } } = req;

        return {
          accessTokenData: accessToken ? await authenticator(accessToken) : undefined
        };
      }
    };
  }
}