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
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const user_model_1 = __importDefault(require("./user.model"));
const createUserBody = {
    type: "object",
    properties: {
        name: { type: "string" },
        email: { type: "string" },
    },
    required: ["name", "email"],
    description: "This is the what the API expects in the request body when creating a new user",
};
const createUserResponse = {
    type: "object",
    properties: {
        id: { type: "number" },
        name: { type: "string" },
        email: { type: "string" },
    },
};
const updateUserBody = {
    type: "object",
    properties: {
        name: { type: "string" },
        email: { type: "string" },
    },
};
const updateUserResponse = {
    type: "object",
    properties: {
        id: { type: "number" },
        name: { type: "string" },
        email: { type: "string" },
    },
};
const deleteUserResponse = {
    type: "object",
    properties: {
        message: { type: "string" },
    },
};
const app = (0, express_1.default)();
app.use(express_1.default.json());
const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "User CRUD API",
            version: "1.0.0",
            description: "A simple CRUD API for users",
        },
        servers: [{ url: "http://localhost:3000" }],
        components: {
            schemas: {
                createUserBody,
                createUserResponse,
                updateUserBody,
                updateUserResponse,
                deleteUserResponse,
            },
        },
        paths: {
            "/users": {
                get: {
                    summary: "Get all users",
                    description: "Get all the users in the database",
                    responses: {
                        "200": {
                            description: "Successfully fetched all users",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/createUserResponse",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                post: {
                    summary: "Create a new User",
                    description: "Create a new user with specified name adn email",
                    requestBody: {
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/createUserBody"
                                }
                            }
                        }
                    },
                    responses: {
                        "201": {
                            description: "Successfully created the new user with given name and email",
                            content: {
                                "application/json": {
                                    schema: {
                                        $ref: "#/components/schemas/createUserResponse"
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Bad Request: Name and Email are required",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/users/{id}": {
                get: {
                    summary: "Get a user by their ID",
                    description: "This returns a user that has the specified ID",
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            description: "The ID of the user to retrieve",
                            required: true,
                            schema: {
                                type: "integer",
                            },
                        },
                    ],
                    responses: {
                        "200": {
                            description: "Successfully fetched the user",
                            content: {
                                "application/json": {
                                    schema: {
                                        $ref: "#/components/schemas/createUserResponse",
                                    },
                                },
                            },
                        },
                        "404": {
                            description: "User not found",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            message: {
                                                type: "string",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                put: {
                    summary: "Update an existing user with the new fields provided",
                    description: "Update the user with the specified ID with the new fields provided",
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            description: "The ID of the user to update",
                            required: true,
                            schema: {
                                type: "integer"
                            }
                        }
                    ],
                    requestBody: {
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/updateUserBody"
                                }
                            }
                        }
                    },
                    responses: {
                        "200": {
                            description: "Successfully updated the user",
                            content: {
                                "application/json": {
                                    schema: {
                                        $ref: "#/components/schemas/updateUserResponse"
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Bad Request: Name or Email required",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "string"
                                    }
                                }
                            }
                        },
                        "404": {
                            description: "User not found",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                }
            },
        },
    },
    apis: ["app.ts"],
};
const swaggerSpecifications = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpecifications, { explorer: true }));
// CRUD Routes
app.get("/", (req, res) => {
    res.send("Hello from Express API!");
});
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dbUsers = yield user_model_1.default.find();
    res.status(200).json(dbUsers);
}));
app.get("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(404).send("User not found");
        return;
    }
    const user = yield user_model_1.default.findById(req.params.id);
    if (!user)
        res.status(404).send("User not found");
    else
        res.status(200).json(user);
}));
app.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    if (!name || !email) {
        res.status(400).send("Name and email are required");
    }
    else {
        const newUser = yield user_model_1.default.create({ name, email });
        res.status(201).json(newUser);
    }
}));
app.put("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(req.params.id);
    if (!user) {
        res.status(404).send("User not found");
    }
    else {
        const { name, email } = req.body;
        if (!name && !email) {
            res.status(400).send("Name or email required");
            return;
        }
        if (name)
            user.name = name;
        if (email)
            user.email = email;
        user.save();
        res.status(200).json(user);
    }
}));
app.delete("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findByIdAndDelete(req.params.id);
    if (!user)
        res.status(404).send("User not found");
    else
        res.status(204).send({ message: "User deleted successfully" });
}));
mongoose_1.default.connect(process.env.MONGO_URL).then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
        console.log("Server started on port 3000");
    });
});
exports.default = app;
// DOCKERFILE 
// DOCKER IMAGE
// DOCKER CONTAINER
// COMMANDS: docker build, docker run, docker ps, docker stop, docker rm, docker rmi, docker exec, docker logs
//# sourceMappingURL=app.js.map