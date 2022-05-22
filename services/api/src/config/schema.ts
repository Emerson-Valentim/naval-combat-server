import { gql } from "apollo-server";

export const typeDefs = gql`
  enum Roles {
    admin
    user
    maintainer
  }

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
  }

  input UpdateSkinInput {
    id: ID!
    cost: Int
    name: String
    images: SkinImagesDefinition
    sounds: SkinSoundDefinition
    status: SkinStatus
  }

  input InitialSetupSkinInput {
    images: SkinImagesDefinition
    sounds: SkinSoundDefinition
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
    scenario: File
    avatar: File
  }

  input SkinSoundDefinition {
    voice: File
  }

  input UpdateRolesInput {
    userId: String!
    roles: [Roles]!
  }

  input RequestFundsInput {
    value: Int!
  }

  input ApproveFundsInput {
    id: String!
  }

  input SelectSkinInput {
    skinId: String!
  }

  input InitialSetupInput {
    user: CreateUserInput!
    skin: InitialSetupSkinInput!
  }

  type User {
    id: ID!
    email: String!
    username: String!
    meta: UserMeta!
    skin: UserSkin!
    roles: [Roles]!
    balance: Int!
  }

  type UserSkin {
    current: Skin!
    available: [String]
  }

  type Skin {
    id: ID!
    cost: Int!
    name: String!
    scenario: String
    avatar: String
    voice: String
    status: SkinStatus!
  }

  type UserMeta {
    wins: Int!
    matches: Int!
    loses: Int!
  }

  type Tokens {
    accessToken: String!
    refreshToken: String!
  }

  type SignIn {
    tokens: Tokens!
    roles: [Roles]!
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

  type Funds {
    id: String!
    username: String!
    status: FundsStatus!
    value: Int!
  }

  enum RoomType {
    PRIVATE
    PUBLIC
  }

  enum RoomStatus {
    CREATING
    CREATED
  }

  enum FundsStatus {
    PENDING
    CREDITED
  }

  enum SkinStatus {
    PENDING
    ACTIVE
    DISABLED
  }

  type Mutation {
    initialSetup(input: InitialSetupInput!): Boolean
    createUser(input: CreateUserInput!): User!
    signIn(input: SignInInput!): SignIn!
    signOut: Boolean
    refresh(input: RefreshTokenInput!): Tokens!
    createRoom(input: CreateRoomInput!): Room!
    joinRoom(input: JoinRoomInput!): Boolean
    addSkin(input: AddSkinInput!): Skin!
    buySkin(input: BuySkinInput!): Boolean
    removeSkin(input: RemoveSkinInput!): Boolean
    updateSkin(input: UpdateSkinInput!): Boolean
    updateRoles(input: UpdateRolesInput!): Boolean
    requestFunds(input: RequestFundsInput!): Boolean
    approveFunds(input: ApproveFundsInput!): Boolean
    selectSkin(input: SelectSkinInput!): Boolean
  }

  type Query {
    status: Boolean!
    getRooms: [Room]
    profile: User!
    getRoom(input: GetRoomInput!): Room!
    getSkins: [Skin]
    getUsers: [User]
    getPendingFunds: [Funds]
  }
`;
