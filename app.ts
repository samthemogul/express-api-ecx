
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

import User from "./user.model";

const createUserBody = {
  type: "object",
  properties: {
    name: { type: "string" },
    email: { type: "string" },
  },
  required: ["name", "email"],
  description:
    "This is the what the API expects in the request body when creating a new user",
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
}

const app = express();
app.use(express.json());

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

const swaggerSpecifications = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecifications, { explorer: true}));

// CRUD Routes

app.get("/", (req, res) => {
  res.send("Hello from Express API!");
})
app.get("/users", async (req, res) => {
  const dbUsers = await User.find();
  res.status(200).json(dbUsers);
});

app.get("/users/:id", async (req: Request, res: Response) => {
  const id:string = req.params.id;
  if(!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).send("User not found");
    return;
  }
  const user = await User.findById(req.params.id);
  if (!user) res.status(404).send("User not found");
  else res.status(200).json(user);
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    res.status(400).send("Name and email are required");
  } else {
    const newUser = await User.create({ name, email });
    res.status(201).json(newUser);
  }
});

app.put("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404).send("User not found");
  } else {
    const { name, email } = req.body;
    if (!name && !email) {
      res.status(400).send("Name or email required");
      return;
    }
    if (name) user.name = name;
    if (email) user.email = email;
    user.save();
    res.status(200).json(user);
  }
});

app.delete("/users/:id", async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) res.status(404).send("User not found");
  else res.status(204).send({ message: "User deleted successfully" });
});

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Connected to MongoDB");
  app.listen(3000, () => {
    console.log("Server started on port 3000");
  });
})

export default app;


// DOCKERFILE 
// DOCKER IMAGE
// DOCKER CONTAINER
// COMMANDS: docker build, docker run, docker ps, docker stop, docker rm, docker rmi, docker exec, docker logs
