import { gql } from "apollo-server";

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

  input AddSkinInput {
    packageName: String!
    cost: Int!
    images: SkinImagesDefinition!
    sounds: SkinSoundDefinition!
  }

  input File {
    filename: String!
    base64: String!
  }

  input BuySkinInput {
    skinId: String!
  }

  input RemoveSkinInput {
    skinId: String!
  }

  input SkinImagesDefinition {
    scenario: File!
    avatar: File!
  }

  input SkinSoundDefinition {
    voice: File!
  }

  type User {
    id: ID!
    email: String!
    username: String!
    meta: UserMeta!
    skin: UserSkin!
  }

  type UserSkin {
    current: Skin!
    available: [String]
  }

  type Skin {
    id: ID!
    name: String!
    scenario: String!
    avatar: String!
    voice: String!
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
    createUser(input: CreateUserInput!): User!
    signIn(input: SignInInput!): SignIn!
    signOut: Boolean
    refresh(input: RefreshTokenInput!): SignIn!
    createRoom(input: CreateRoomInput!): Room!
    joinRoom(input: JoinRoomInput!): Boolean
    addSkin(input: AddSkinInput!): Boolean
    buySkin(input: BuySkinInput!): Boolean
    removeSkin(input: RemoveSkinInput!): Boolean
  }

  type Query {
    status: Boolean!
    getRooms: [Room]
    profile: User!
    getRoom(input: GetRoomInput!): Room!
    getSkins: [Skin]
  }
`;
