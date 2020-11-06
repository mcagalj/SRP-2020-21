exports.getTestQuery = {
  title: "Query test by name and user id",
  type: "object",
  properties: {
    query: {
      type: "object",
      properties: {
        name: { type: "string", minLength: 1 },
        UserId: { type: "integer" },
      },
      anyOf: [{ required: ["name"] }, { required: ["UserId"] }],
    },
  },
  required: ["query"],
};

exports.createTest = {
  title: "Create test",
  type: "object",
  properties: {
    UserId: { type: "integer", minimum: 1 },
    name: { type: "string", minLength: 1 },
    result: { type: "string", minLength: 1 },
    timestamp: { type: "string" },
  },
  required: ["UserId", "name", "result", "timestamp"],
};
