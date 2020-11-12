const winston = require("winston");
const { RateLimiterMemory } = require("rate-limiter-flexible");
const config = require("../../config");
const { loginServiceInstance } = require("../../services");

const Logger = winston.loggers.get("logger");

// Setup Rate Limiter
const loginRateLimiter = new RateLimiterMemory(config.rateLimiter.loginPath);

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const loginRateLimiterRes = await loginRateLimiter.get(username);

    const { user, token } = await loginServiceInstance.login({
      username,
      password,
    });

    if (loginRateLimiterRes && loginRateLimiterRes.consumedPoints > 0) {
      await loginRateLimiter.delete(username);
    }

    return res.json({ user, token });
  } catch (err) {
    Logger.error(err);

    switch (err.name) {
      case "UsernameValidationError":
        return res.status(401).json({ error: { message: err.message } });
      case "PasswordValidationError":
        try {
          await loginRateLimiter.consume(err.username);
          return res.status(401).json({ error: { message: err.message } });
        } catch (rlRejected) {
          if (rlRejected instanceof Error) {
            return res
              .status(400)
              .json({ error: { message: rlRejected.message } });
          } else {
            res.set({
              "Retry-After": Math.round(rlRejected.msBeforeNext / 1000) || 1,
            });
            return res
              .status(429)
              .json({ error: { message: "Too Many Requests" } });
          }
        }
      default:
        return res.status(400).json({ error: { message: err.message } });
    }
  }
};
