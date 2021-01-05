// ! We use slower (JavaScript) implementation here for convenience;
// ! in production you should use faster C++ bcrypt binding.
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

class UsernameValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "UsernameValidationError";
  }
}

class PasswordValidationError extends Error {
  constructor(message, username) {
    super(message);
    this.name = "PasswordValidationError";
    this.username = username;
  }
}

class LoginService {
  constructor({ logger, userModel }) {
    this.userModel = userModel;
    this.logger = logger;
  }

  async login({ username, password }) {
    const userRecord = await this.userModel.findOne({
      where: { username },
    });

    if (!userRecord) {
      this.logger.error("User not registered");
      throw new UsernameValidationError("Authentication failed");
    }

    this.logger.info("Checking password");
    const validPassword = await bcrypt.compare(password, userRecord.password);
    if (validPassword) {
      this.logger.info("Password correct so proceed and generate a JWT");

      const user = {
        username: userRecord.username,
        role: userRecord.roleId || "",
      };

      const payload = {
        ...user,
        aud: config.jwt.audience || "localhost/api",
        iss: config.jwt.issuer || "localhost@fesb",
      };

      this.logger.info(
        `Sign JWT for user: ${userRecord.username} (${userRecord.id})`
      );
      const token = this.generateToken(payload);

      return { user, token };
    }

    this.logger.error("Invalid password");
    throw new PasswordValidationError("Authentication failed", username);
  }

  generateToken(payload) {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }
}

module.exports = LoginService;
