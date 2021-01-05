const { defineAbility } = require("@casl/ability");

const ability = defineAbility((can, cannot) => {
  can("manage", "all");
  cannot("delete", "User");
});

console.log(ability.can("delete", "User"));
