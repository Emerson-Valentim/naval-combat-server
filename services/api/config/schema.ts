import { gql } from 'apollo-server';

export const typeDefs = gql`
  input ExampleInput {
    value: String!
  }

  type Query {
    status: Boolean!
  }

  type Mutation {
    example(input: ExampleInput!): Boolean
  }

`;