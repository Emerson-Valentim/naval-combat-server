import { gql } from 'apollo-server';

export const typeDefs = gql`
  input ExampleInput {
    value: String!
  }

  input CreateUserInput {
    email: String!
    username: String!
    password: String!
  }

  input SignInInput {
    email: String!
    password: String!
  }

  input RefreshTokenInput {
    refreshToken: String!
  }

  type User {
    email: String!
    username: String!
    meta: UserMeta!
  }

  type UserMeta {
    wins: Int!
    matches: Int!
    loses: Int!
  }

  type SignIn {
    accessToken: String!
    refreshToken: String!
  }

  type Query {
    status: Boolean!
  }

  type Mutation {
    example(input: ExampleInput!): Boolean
    createUser(input: CreateUserInput!): User!
    signIn(input: SignInInput!): SignIn!
    signOut: Boolean
    refresh(input: RefreshTokenInput!): SignIn!
  }

`;