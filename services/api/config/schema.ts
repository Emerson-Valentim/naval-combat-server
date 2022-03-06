import { gql } from 'apollo-server';

export const typeDefs = gql`
  input ExampleInput {
    value: String!
  }

  input CreateUserInput {
    email: String!
    userName: String!
    password: String!
  }

  type User {
    email: String!
    userName: String!
    meta: UserMeta!
  }

  type UserMeta {
    wins: Int!
    matches: Int!
    loses: Int!
  }

  type Query {
    status: Boolean!
  }

  type Mutation {
    example(input: ExampleInput!): Boolean
    createUser(input: CreateUserInput!): User!
  }

`;