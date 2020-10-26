exports.getUser = {
  title: "Find user by a username",
  type: "object",
  properties: {
    username: { type: "string" },
  },
  required: ["username"],
};

exports.createUser = {
  title: "Add a new user",
  type: "object",
  properties: {
    username: { type: "string", minLength: 1 },
    password: { type: "string", minLength: 8 },
  },
  required: ["username", "password"],
};

exports.deleteUser = {
  title: "Delete an existing user",
  type: "object",
  properties: {
    username: { type: "string", minLength: 1 },
  },
  required: ["username"],
};
