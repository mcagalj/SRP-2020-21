const { subject } = require("@casl/ability");
const {
  defineRulesFor,
  defineAbilityFor,
} = require("./config/authorization-rules");

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

console.log(`admin can delete Role: ${user1.ability.can("delete", "Role")}`);
console.log(`user can delete Role: ${user2.ability.can("delete", "Role")}`);
console.log(`guest can delete Role: ${user3.ability.can("delete", "Role")}`);
console.log(`doctor can delete Role: ${doctor.ability.can("delete", "Role")}`);
