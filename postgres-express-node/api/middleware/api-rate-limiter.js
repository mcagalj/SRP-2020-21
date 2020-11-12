// SOURCE: https://akashwho.codes/blog/api-rate-limit-in-nodejs-and-expressjs/
const { RateLimiterMemory } = require("rate-limiter-flexible");
const config = require("../../config");

// Setup Rate Limiter
const rateLimiter = new RateLimiterMemory(config.rateLimiter.global);

// Setup the middleware using the rate limiter config
const rateLimiterMiddleware = async (req, res, next) => {
  // On the basis of ip address, but can be modified according to your needs
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (rateLimiterRes) {
    res.set({
      "Retry-After": rateLimiterRes.msBeforeNext / 1000,
      "X-RateLimit-Limit": config.rateLimiter.global.points,
      "X-RateLimit-Remaining": rateLimiterRes.remainingPoints,
      "X-RateLimit-Reset": new Date(Date.now() + rateLimiterRes.msBeforeNext),
    });
    res.status(429).json({ error: { message: "Too Many Requests" } });
  }
};

module.exports = rateLimiterMiddleware;
