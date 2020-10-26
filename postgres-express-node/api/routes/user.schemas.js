exports.getUser = {
  title: "Find user by a username",
  type: "object",
  properties: {
    username: { type: "string" },
  },
  required: ["username"],
};
