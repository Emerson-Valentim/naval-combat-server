import { buildMock as buildAccessTokenMock } from "../../access-token/__tests__/access-token-factory";
import signOut from "../sign-out";

const buildMock = ({ accessTokenMock }: any = {}) => ({
  AccessToken: buildAccessTokenMock(accessTokenMock),
});

describe("signOut()", () => {
  it("calls revoke", async () => {
    const { AccessToken } = buildMock({
      userMock: {
        list: jest.fn().mockResolvedValue([])
      }
    });

    await signOut(AccessToken, "user-id");

    expect(AccessToken.revoke).toBeCalledWith("user-id");
  });
});
