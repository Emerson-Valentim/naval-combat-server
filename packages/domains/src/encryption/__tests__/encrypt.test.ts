import jwt from "jsonwebtoken";

import encrypt from "../encrypt";
import { buildMock as buildSecretMock} from "../../secrets/__tests__/secrets-factory";

const buildMock = (mocks?: any) => ({
  SecretManager: buildSecretMock(mocks?.secretManager)
});

test("should fail because message is empty", async () => {
  const {
    SecretManager
  } = buildMock();

  await expect(encrypt(SecretManager, "")).rejects.toThrow("Message should be a valid string");
});

test("should fail because message is an object", async () => {
  const {
    SecretManager
  } = buildMock();

  // @ts-expect-error it should error because input is not a string
  await expect(encrypt(SecretManager, {})).rejects.toThrow("Message should be a valid string");
});

test("should fail because SecretManager get failed", async () => {
  const {
    SecretManager
  } = buildMock({
    secretManager: {
      get: jest.fn().mockRejectedValue(new Error("connection refused"))
    }
  });

  await expect(encrypt(SecretManager, "message")).rejects.toThrow("Failed to get secret: connection refused");
});

test("should return an encrypted message", async () => {
  const mockSecret = "secret-test";
  const mockMessage = "message";

  const expectedMessage = jwt.sign(mockMessage, mockSecret, { algorithm: "HS256" });

  const {
    SecretManager
  } = buildMock({
    secretManager: {
      get: jest.fn().mockResolvedValue(mockSecret)
    }
  });

  const response = await encrypt(SecretManager, "message");

  expect(response).toEqual(expectedMessage);
});