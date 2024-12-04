const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/userModel");

beforeAll(async () => {
  await User.deleteMany({});
});

describe("User Routes", () => {
  describe("POST /api/users/signup", () => {
    it("should signup a new user with valid credentials", async () => {
      // Arrange
      const userData = {
        name: "testman",
        username: "test@example.com",
        password: "R3g5T7#gh",
        gender:"male",
        phone_number: "09-123-47890",
        date_of_birth: "1999-01-01",
        membership_status: "Active",
        address:"kettujen kettu",
        profile_picture:"kettu"
      };

      // Act
      const result = await api.post("/api/users/signup").send(userData);

      // Assert
      expect(result.status).toBe(201);
      expect(result.body).toHaveProperty("token");
    });
    it("should signup a new user with valid credentials without profile_picture", async () => {
      // Arrange
      const userData = {
        name: "testman",
        username: "test1@example.com",
        password: "R3g5T7#gh",
        gender:"male",
        phone_number: "09-123-47890",
        date_of_birth: "1999-01-01",
        membership_status: "Active",
        address:"kettujen kettu"
      };

      // Act
      const result = await api.post("/api/users/signup").send(userData);

      // Assert
      console.error(result)
      expect(result.status).toBe(201);
      expect(result.body).toHaveProperty("token");
      expect(result.profile_picture).toBe(null);
    });

    it("should return an error with invalid credentials", async () => {
      // Arrange
      const userData = {
        name:"dubbadii",
        username: "test@example.com",
        password: "invalidpassword",
        phone_number: "1234567890",
        date_of_birth: "1990-01-01",
        membership_status: "Active",
        address:"kettukatu",
        profile_picture:"jaa"
      };

      // Act
      const result = await api.post("/api/users/signup").send(userData);

      // Assert
      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("error");
    });
  });

  describe("POST /api/users/login", () => {
    it("should login a user with valid credentials", async () => {
      // Arrange
      const userData = {
        username: "test@example.com",
        password: "R3g5T7#gh",
      };

      // Act
      const result = await api.post("/api/users/login").send(userData);

      // Assert
      expect(result.status).toBe(200);
      expect(result.body).toHaveProperty("token");
    });

    it("should return an error with invalid credentials", async () => {
      // Arrange
      const userData = {
        username: "test@example.com",
        password: "invalidpassword",
      };

      // Act
      const result = await api.post("/api/users/login").send(userData);

      // Assert
      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("error");
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
