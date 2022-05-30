import { gql } from "apollo-server";

export const typeDefs = gql`
  scalar BoardState

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
    images: SkinImagesDefinition
    sounds: SkinSoundDefinition
  }

  input UpdateSkinInput {
    id: ID!
    cost: Int
    name: String
    images: SkinImagesDefinition
    sounds: SkinSoundDefinition
    status: SkinStatus
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
    ship1: File
    ship2: File
    ship3: File
    ship4: File
    ship5: File
  }

  input SkinSoundDefinition {
    voiceYes: File
    voiceNo: File
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
  }

  input Position {
    row: Int!
    column: Int!
  }

  input IndividualSetupInput {
    roomId: String!
    positions: [Position]
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
    ship1: String
    ship2: String
    ship3: String
    ship4: String
    ship5: String
    voiceNo: String
    voiceYes: String
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
    board: Board!
  }

  type Funds {
    id: String!
    username: String!
    status: FundsStatus!
    value: Int!
  }
  
  type Board {
    currentPlayer: String!
    size: Int!
    status: BoardStatus!
    state: BoardState!
  }

  enum BoardStatus {
    PENDING
    DONE
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
    individualSetup(input: IndividualSetupInput!): Boolean
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
