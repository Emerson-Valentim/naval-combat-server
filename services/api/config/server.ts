import { ApolloServer as LocalApolloServer } from 'apollo-server';
import { ApolloServer as LambdaApolloServer } from 'apollo-server-lambda';

import { resolvers } from "./resolvers";
import { typeDefs } from "./schema";

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

  protected static generateConfig() {
    return {
      typeDefs: Server.typeDefs,
      resolvers: Server.resolvers,
      cors: true
    };
  }
}