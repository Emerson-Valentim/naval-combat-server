export type Roles = "admin" | "maintainer" | "user"

export interface AuthToken {
  userId: string;
  exp: number;
  roles: Roles[]
}