// In this app we use fixed/static permissions and rules.
// Therfore, we will hardcode them; a more flexible approach
// would be to read permission/rules from a database.
//
// Source: https://github.com/stalniy/casl-examples/blob/master/packages/express-blog/src/modules/auth/abilities.js

const { AbilityBuilder, Ability, subject } = require("@casl/ability");

let ANONYMOUS_ABILITY;

function defineAbilityFor(user) {
  if (user) {
    return new Ability(defineRulesFor(user));
  }

  ANONYMOUS_ABILITY = ANONYMOUS_ABILITY || new Ability(defineRulesFor({}));
  return ANONYMOUS_ABILITY;
}

function defineRulesFor(user) {
  const builder = new AbilityBuilder(Ability);

  switch (user.role) {
    case "admin":
      defineAdminRules(builder);
      break;
    case "user":
      defineAnonymousRules(builder);
      defineUserRules(builder, user);
      break;
    case "doctor":
      defineAnonymousRules(builder);
      defineUserRules(builder, user);
      defineDoctorRules(builder);
      break;
    default:
      defineAnonymousRules(builder);
      break;
  }

  return builder.rules;
}

// =============================
// "Roles-permissions" mapping
// -----------------------------
function defineAdminRules({ can }) {
  can("manage", "all");
}

function defineUserRules({ can }, user) {
  // users can only manage own records
  can(["read", "create", "delete", "update"], "User", {
    id: user.id,
  });
  can(["read", "create", "delete", "update"], "MedicalTest", {
    UserId: user.id,
  });
}

function defineDoctorRules({ can }) {
  can(["read"], "MedicalTest");
}

function defineAnonymousRules({ can }) {}

module.exports = {
  defineRulesFor,
  defineAbilityFor,
};

const user1 = { id: 1, role: "admin" };
const user2 = { id: 2, role: "user" };
const user3 = { id: 3, role: "guest" };
const doctor = { id: 4, role: "doctor" };

// Define rules
user1.rules = defineRulesFor(user1);
user2.rules = defineRulesFor(user2);
user3.rules = defineRulesFor(user3);
doctor.rules = defineRulesFor(doctor);
console.log("\nRole: ADMIN");
console.table(user1.rules);

console.log("\nRole: USER");
console.table(user2.rules);
// console.log(JSON.stringify(user2, null, 2));

console.log("\nRole: GUEST");
console.table(user3.rules);

console.log("\nRole: DOCTOR");
console.table(doctor.rules);
// console.log(JSON.stringify(doctor, null, 2));

// Define abilities
user1.ability = defineAbilityFor(user1);
user2.ability = defineAbilityFor(user2);
user3.ability = defineAbilityFor(user3);
doctor.ability = defineAbilityFor(doctor);

console.log(
  `user1 can delete MedicalTest: ${user1.ability.can("delete", "MedicalTest")}`
);
console.log(
  `user1 can read MedicalTest: ${user1.ability.can("read", "MedicalTest")}`
);

console.log(
  `user2 can read MedicalTest: ${user2.ability.can("read", "MedicalTest")}` // asks "can I read at least one MedicalTest?"
);

const MedicalTest1 = subject("MedicalTest", {
  id: 1,
  UserId: 1,
  test: "Covid",
  result: "negative",
  createdAt: new Date().setHours(0, 0, 0, 0),
});

const MedicalTest2 = subject("MedicalTest", {
  id: 2,
  UserId: 2,
  test: "Covid",
  result: "positive",
});

const MedicalTest3 = subject("MedicalTest", {
  id: 3,
  UserId: 3,
  test: "Covid",
  result: "positive",
});

const MedicalTest4 = subject("MedicalTest", {
  id: 4,
  UserId: 4,
  test: "HIV",
  result: "positive",
});

console.log(
  `user2 can read MedicalTest 1: ${user2.ability.can("read", MedicalTest1)}`
);

console.log(
  `user2 can read MedicalTest 2: ${user2.ability.can("read", MedicalTest2)}`
);

console.log(
  `user2 can read MedicalTest 3: ${user2.ability.can("read", MedicalTest3)}`
);

console.log(
  `admin can read MedicalTest 3: ${user1.ability.can("read", MedicalTest3)}`
);

console.log(
  `user3 can read MedicalTest 3: ${user3.ability.can("read", MedicalTest3)}`
);

console.log(
  `doctor can read MedicalTest 3: ${doctor.ability.can("read", MedicalTest3)}`
);
console.log(
  `doctor can delete MedicalTest 3: ${doctor.ability.can(
    "delete",
    MedicalTest3
  )}`
);

console.log(
  `admin can delete MedicalTest 3: ${user1.ability.can("delete", MedicalTest3)}`
);

console.log(
  `doctor can delete MedicalTest 4: ${doctor.ability.can(
    "delete",
    MedicalTest4
  )}`
);

console.log(
  `guest can delete MedicalTest 4: ${user3.ability.can("delete", MedicalTest4)}`
);
