import decrypt from "../decrypt";
import { buildMock as buildSecretMock} from "../../secrets/__tests__/secrets-factory";

const buildMock = (mocks?: any) => ({
  SecretManager: buildSecretMock(mocks?.secretManager)
});

test("should fail because message is empty", async () => {
  const {
    SecretManager
  } = buildMock();

  await expect(decrypt(SecretManager, "")).rejects.toThrow("Message should be a valid string");
});

test("should fail because message is an object", async () => {
  const {
    SecretManager
  } = buildMock();

  // @ts-expect-error it should error because input is not a string
  await expect(decrypt(SecretManager, {})).rejects.toThrow("Message should be a valid string");
});

test("should fail because SecretManager get failed", async () => {
  const {
    SecretManager
  } = buildMock({
    secretManager: {
      get: jest.fn().mockRejectedValue(new Error("connection refused"))
    }
  });

  await expect(decrypt(SecretManager, "message")).rejects.toThrow("Failed to get secret: connection refused");
});

test("should return an decrypted message", async () => {
  const mockSecret = "secret-test";
  const mockMessage = "message";

  const {
    SecretManager
  } = buildMock({
    secretManager: {
      get: jest.fn().mockResolvedValue(mockSecret)
    }
  });

  const response = await decrypt(SecretManager, "eyJhbGciOiJIUzI1NiJ9.bWVzc2FnZQ.Nw2SK29A2tM_NNOE9A9jTgS4hMLa9pkewpGKKLmLxlE");

  expect(response).toEqual(mockMessage);
});