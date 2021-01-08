// const LRU = require("lru-cache");
const { defineAbilityFor } = require("../../config/authorization-rules");

// const ABILITIES_CACHE = new LRU(100); // set the cache size

const provideAbility = (req, _, next) => {
  req.ability = defineAbilityFor(req.user);
  next();
};

// Cached version
// const provideAbility = (req, _, next) => {
//   if (!req.user) {
//     req.ability = defineAbilityFor();
//     return next();
//   }

//   if (ABILITIES_CACHE.has(req.user.id)) {
//     req.ability = ABILITIES_CACHE.get(req.user.id);
//   } else {
//     req.ability = defineAbilityFor(req.user);
//     ABILITIES_CACHE.set(req.user.id, req.ability);
//   }
//   next();
// };

module.exports = provideAbility;
