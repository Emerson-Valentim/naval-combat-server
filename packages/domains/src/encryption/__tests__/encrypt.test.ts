import jwt from "jsonwebtoken";

import encrypt from "../encrypt";

const buildMock = (mocks?: any) => {
  return {
    SecretManager: {
      ...jest.requireMock("../../secrets"),
      ...mocks?.secretManager
    }
  };
};

test("should fail because message is not a string", async () => {
  const {
    SecretManager
  } = buildMock();

  await expect(encrypt(SecretManager, "")).rejects.toThrow("Message should be a valid string");
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