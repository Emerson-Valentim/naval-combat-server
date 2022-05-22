import { Roles } from "../../access-token/@types/auth-token";
import updateRoles from "../update-roles";

import { buildMock as buildUserMock, buildUser } from "./user-factory";

const buildMock = ({ userMock }: any = {}) => ({
  Database: buildUserMock(userMock),
  Socket: {
    emit: jest.fn(),
  },
});

describe("updateRoles()", () => {
  const user = buildUser({
    id: "user-id",
  });
  const agent = buildUser({
    id: "agent-id",
  });

  const input = {
    userId: user.id,
    agentId: agent.id,
    roles: ["user"] as Roles[],
  };

  it("provides roles and update user", async () => {
    const { Database, Socket } = buildMock({
      userMock: {
        findById: jest
          .fn()
          .mockImplementation((id) =>
            [user, agent].find(({ id: filterId }) => filterId === id)
          ),
      },
    });

    await updateRoles(Database, Socket, input);

    expect(Database.update).toBeCalledWith({
      id: user.id,
      roles: input.roles,
    });
    expect(Socket.emit).toBeCalledWith({
      channel: "server:user:update",
      message: { id: user.id },
    });
  });

  describe("database don't find an agent", () => {
    it("throws an error", async () => {
      const { Database, Socket } = buildMock({
        userMock: {
          findById: jest
            .fn()
            .mockImplementation((id) =>
              [user].find(({ id: filterId }) => filterId === id)
            ),
        },
      });

      await expect(updateRoles(Database, Socket, input)).rejects.toThrowError(
        "Agent not found"
      );
    });
  });

  describe("database don't find an user", () => {
    it("throws an error", async () => {
      const { Database, Socket } = buildMock({
        userMock: {
          findById: jest
            .fn()
            .mockImplementation((id) =>
              [agent].find(({ id: filterId }) => filterId === id)
            ),
        },
      });

      await expect(updateRoles(Database, Socket, input)).rejects.toThrowError(
        "User not found"
      );
    });
  });

  describe("agent doesn't have provided role", () => {
    it("throws an error", async () => {
      const { Database, Socket } = buildMock({
        userMock: {
          findById: jest
            .fn()
            .mockImplementation((id) =>
              [agent].find(({ id: filterId }) => filterId === id)
            ),
        },
      });

      await expect(updateRoles(Database, Socket, {
        ...input,
        roles: ["admin", "maintainer"]
      })).rejects.toThrowError(
        "User can't provide access"
      );
    });
  });
});
