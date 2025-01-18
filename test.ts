import axios from "axios";
import app from "./app";
import request from "supertest";
import mockingoose from "mockingoose";
import User from "./user.model";


jest.mock("axios");

describe("Express API Routes test", () => {
  // describe("GET /users", () => {
  //   it("should return all users", async () => {
  //     const response = await request(app).get("/users");
  //     expect(response.statusCode).toBe(200);
  //     expect(response.body).toHaveLength(4);
  //   });
  // });
  describe("GET /users/:id", () => {
    it("should return a user if found", async () => {
      const response = await request(app).get("/users/1");
      const user = { id: 1, name: "John Doe", email: "john.doe@example.com" };
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(user);
    });
    it("should return 404 if user is not found", async () => {
      const response = await request(app).get("/users/100");
      expect(response.statusCode).toBe(404);
      expect(response.text).toBe("User not found");
    });
  });
  describe("POST /users", () => {
    it("should create a new user", async () => {
      const newUSer = { name: "Samuel", email: "samuel@gmail.com" };
      const response = await request(app).post("/users").send(newUSer);
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({
        id: 5,
        name: "Samuel",
        email: "samuel@gmail.com",
      });
    });
    it("should return 400 if name is missing", async () => {
      const response = await request(app)
        .post("/users")
        .send({ email: "samuel@gmail.com" });
      expect(response.statusCode).toBe(400);
      expect(response.text).toBe("Name and email are required");
    });
  });
  describe("PUT /users/:id", () => {
    it("should update an existing user", async () => {
      const updates = { name: "John Walter" };
      const response = await request(app).put("/users/1").send(updates);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        name: "John Walter",
        email: "john.doe@example.com",
      });
    });
    it("should return 400 if no field is provided", async () => {
      const response = await request(app).put("/users/1").send({});
      expect(response.statusCode).toBe(400);
      expect(response.text).toBe("Name or email required");
    });
    it("should return 404 if user is not found", async () => {
      const response = await request(app)
        .put("/users/100")
        .send({ name: "John Walter" });
      expect(response.statusCode).toBe(404);
      expect(response.text).toBe("User not found");
    });
  });
  describe("GET /api", () => {
    it("should return all users in the API", async () => {
      let users = [
        { id: 1, name: "John Doe", email: "john.doe@example.com" },
        { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
        { id: 3, name: "Tom Jones", email: "tom.jones@example.com" },
        { id: 4, name: "Bob Johnson", email: "bob.johnson@example.com" },
      ];
      (axios.get as jest.Mock).mockResolvedValue({ data: users });
      const response = await request(app).get("/api");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(users);
    });
  });

  describe("GET database users", () => {
    it("should return all users in the database", async () => {
      mockingoose(User).toReturn([
        { id: 1, name: "John Doe", email: "john.doe@example.com" },
        { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
        { id: 3, name: "Tom Jones", email: "tom.jones@example.com" },
        { id: 4, name: "Bob Johnson", email: "bob.johnson@example.com" },
      ], "find");

      const response = await request(app).get("/users");
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(4);
    })
  })
});
