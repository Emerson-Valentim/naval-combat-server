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

  input CreateRoomInput {
    title: String!
    type: RoomType!
    limit: Int!
  }

  input JoinRoomInput {
    roomId: String!
  }

  input GetRoomInput {
    roomId: String!
  }

  type User {
    id: String
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

  type Room {
    id: String!
    owner: String
    title: String
    type: RoomType
    players: [String]
    limit: Int!
    status: RoomStatus
  }

  enum RoomType {
    PRIVATE
    PUBLIC
  }

  enum RoomStatus {
    CREATING
    CREATED
  }

  type Mutation {
    example(input: ExampleInput!): Boolean
    createUser(input: CreateUserInput!): User!
    signIn(input: SignInInput!): SignIn!
    signOut: Boolean
    refresh(input: RefreshTokenInput!): SignIn!
    createRoom(input: CreateRoomInput!): Room!
    joinRoom(input: JoinRoomInput!): Boolean
  }

  type Query {
    status: Boolean!
    getRooms: [Room]
    profile: User!
    getRoom(input: GetRoomInput!): Room!
  }

`;