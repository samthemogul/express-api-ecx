"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const app_1 = __importDefault(require("./app"));
const supertest_1 = __importDefault(require("supertest"));
const mockingoose_1 = __importDefault(require("mockingoose"));
const user_model_1 = __importDefault(require("./user.model"));
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
        it("should return a user if found", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default).get("/users/1");
            const user = { id: 1, name: "John Doe", email: "john.doe@example.com" };
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(user);
        }));
        it("should return 404 if user is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default).get("/users/100");
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe("User not found");
        }));
    });
    describe("POST /users", () => {
        it("should create a new user", () => __awaiter(void 0, void 0, void 0, function* () {
            const newUSer = { name: "Samuel", email: "samuel@gmail.com" };
            const response = yield (0, supertest_1.default)(app_1.default).post("/users").send(newUSer);
            expect(response.statusCode).toBe(201);
            expect(response.body).toEqual({
                id: 5,
                name: "Samuel",
                email: "samuel@gmail.com",
            });
        }));
        it("should return 400 if name is missing", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/users")
                .send({ email: "samuel@gmail.com" });
            expect(response.statusCode).toBe(400);
            expect(response.text).toBe("Name and email are required");
        }));
    });
    describe("PUT /users/:id", () => {
        it("should update an existing user", () => __awaiter(void 0, void 0, void 0, function* () {
            const updates = { name: "John Walter" };
            const response = yield (0, supertest_1.default)(app_1.default).put("/users/1").send(updates);
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                id: 1,
                name: "John Walter",
                email: "john.doe@example.com",
            });
        }));
        it("should return 400 if no field is provided", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default).put("/users/1").send({});
            expect(response.statusCode).toBe(400);
            expect(response.text).toBe("Name or email required");
        }));
        it("should return 404 if user is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .put("/users/100")
                .send({ name: "John Walter" });
            expect(response.statusCode).toBe(404);
            expect(response.text).toBe("User not found");
        }));
    });
    describe("GET /api", () => {
        it("should return all users in the API", () => __awaiter(void 0, void 0, void 0, function* () {
            let users = [
                { id: 1, name: "John Doe", email: "john.doe@example.com" },
                { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
                { id: 3, name: "Tom Jones", email: "tom.jones@example.com" },
                { id: 4, name: "Bob Johnson", email: "bob.johnson@example.com" },
            ];
            axios_1.default.get.mockResolvedValue({ data: users });
            const response = yield (0, supertest_1.default)(app_1.default).get("/api");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(users);
        }));
    });
    describe("GET database users", () => {
        it("should return all users in the database", () => __awaiter(void 0, void 0, void 0, function* () {
            (0, mockingoose_1.default)(user_model_1.default).toReturn([
                { id: 1, name: "John Doe", email: "john.doe@example.com" },
                { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
                { id: 3, name: "Tom Jones", email: "tom.jones@example.com" },
                { id: 4, name: "Bob Johnson", email: "bob.johnson@example.com" },
            ], "find");
            const response = yield (0, supertest_1.default)(app_1.default).get("/users");
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveLength(4);
        }));
    });
});
//# sourceMappingURL=test.js.map