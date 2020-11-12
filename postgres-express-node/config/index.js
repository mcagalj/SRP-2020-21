const dotenv = require("dotenv");

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("Couldn't find .env file");
}

/**
 * Express app config
 */
module.exports = {
  port: process.env.PORT,

  // For winston and morgan loggers
  logs: {
    winston: {
      level: process.env.LOG_LEVEL || "debug",
    },
    morgan: {
      format: process.env.MORGAN_FORMAT || "combined",
    },
  },

  api: {
    prefix: "/api",
  },

  bcrypt: {
    SALT_ROUNDS: process.env.SALT_ROUNDS || 12,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    expiresIn: process.env.JWT_DURATION || "1h",
    exclude: { path: [{ url: "/api/login", methods: ["POST"] }] },
  },

  // API rate limiter
  rateLimiter: {
    global: {
      points: 10, // number of requests
      duration: 60, // per "duration" seconds by an IP
    },
  },
};
