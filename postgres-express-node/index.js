const {
  AbilityBuilder,
  Ability,
  ForbiddenError,
  subject,
} = require("@casl/ability");

// * =============================
// *  Users
// * -----------------------------
const admin = { id: 1, role: "admin" };
const doctor = { id: 2, role: "doctor" };
const user_1 = { id: 3, role: "user" };
const user_2 = { id: 4, role: "user" };
const anonymous = {};

// * =============================
// *  MedicalTests
// * -----------------------------
const MedicalTest_1 = subject("MedicalTest", {
  id: 1,
  UserId: 1,
  test: "Covid",
  result: "negative",
  createdAt: new Date().setHours(0, 0, 0),
});

// console.log(MedicalTest_1.__caslSubjectType__);

const MedicalTest_2 = subject("MedicalTest", {
  id: 2,
  UserId: 2,
  test: "Covid",
  result: "positive",
  createdAt: new Date().setHours(0, 0, 0),
});

const MedicalTest_3 = subject("MedicalTest", {
  id: 3,
  UserId: 3,
  test: "Covid",
  result: "positive",
  createdAt: new Date().setHours(0, 0, 0),
});

const MedicalTest_4 = subject("MedicalTest", {
  id: 4,
  UserId: 3,
  test: "HIV",
  result: "positive",
  createdAt: new Date().setHours(0, 0, 0),
});

const MedicalTest_5 = subject("MedicalTest", {
  id: 5,
  UserId: 4,
  test: "Swine flue",
  result: "positive",
  createdAt: new Date().setHours(0, 0, 0),
});

// * =============================
// *  Roles <--> permissions
// * -----------------------------
function defineAdminRules({ can }, user) {
  can("manage", "all");
}

function defineDoctorRules({ can }, user) {
  // We allow doctors read access to all MedicalTests.
  // To implement this policy in CASL we use a simple
  // trick of merely checking if field UserId field
  // exists in the given MedicalTest object (we do not
  // verify the owner of the given test as in the case
  // of regular users).
  //
  // To learn more about the used operator "$exists"
  // please check: https://casl.js.org/v4/en/guide/conditions-in-depth
  can("read", "MedicalTest", { UserId: { $exists: true } });
}

function defineUserRules({ can }, user) {
  // entity User
  can(["read", "delete"], "User", { id: user.id });
  can(["update"], "User", ["username", "password"], {
    id: user.id,
  });

  // entity MedicalTest
  can(["create", "read", "delete"], "MedicalTest", {
    UserId: user.id,
  });
  can(["update"], "MedicalTest", ["test", "result"], {
    UserId: user.id,
  });
}

function defineAnonymousRules({ can }, user) {
  // entity User
  can("create", "User");
}

// * =============================
// *  CASL rules for user
// * -----------------------------
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

// * =============================
// *  CASL abilities for user
// * -----------------------------
let ANONYMOUS_ABILITY;

function defineAbilityFor(user) {
  if (user) {
    return new Ability(defineRulesFor(user));
  }

  ANONYMOUS_ABILITY = ANONYMOUS_ABILITY || new Ability(defineRulesFor({}));
  return ANONYMOUS_ABILITY;
}

// ! =============================
// !  Testing CASL abilities
// ! -----------------------------
admin.ability = defineAbilityFor(admin);
doctor.ability = defineAbilityFor(doctor);
user_1.ability = defineAbilityFor(user_1);
user_2.ability = defineAbilityFor(user_2);
anonymous.ability = defineAbilityFor(anonymous);

const userDetails = (user) =>
  user.id
    ? `\nUser ${user.id} with role ${user.role.toUpperCase()}`
    : "\nUser with role ANONYMOUS";

const getAbilityFor = (user, object, action) =>
  user.id
    ? console.log(
        `Can User ${user.id} (${user.role.toUpperCase()}) "${action}" ${
          object.__caslSubjectType__
        } ${object.id} (of User ${object.UserId})?`,
        user.ability.can(action, object)
      )
    : console.log(
        `Can ANONYMOUS user "${action}" ${object.__caslSubjectType__} ${object.id} (of User ${object.UserId})?`,
        user.ability.can(action, object)
      );

const getAbilityForField = (user, object, action, field) =>
  user.id
    ? console.log(
        `Can User ${
          user.id
        } (${user.role.toUpperCase()}) "${action}" field "${field}" of ${
          object.__caslSubjectType__
        } ${object.id} (of User ${object.UserId ? object.UserId : object.id})?`,
        user.ability.can(action, object, field)
      )
    : console.log(
        `Can ANONYMOUS user "${action}" field "${field}" of ${
          object.__caslSubjectType__
        } ${object.id} (of User ${object.UserId ? object.UserId : object.id})?`,
        user.ability.can(action, object, field)
      );

// ! ADMIN
console.group(userDetails(admin));
console.table(admin.ability.rules);
getAbilityFor(admin, MedicalTest_3, "read");
getAbilityFor(admin, MedicalTest_4, "update");
getAbilityFor(admin, MedicalTest_5, "delete");
console.groupEnd();

// ! DOCTOR
console.group(userDetails(doctor));
console.table(doctor.ability.rules);
getAbilityFor(doctor, MedicalTest_3, "read");
getAbilityFor(doctor, MedicalTest_4, "update");
getAbilityFor(doctor, MedicalTest_5, "delete");
getAbilityFor(doctor, MedicalTest_2, "update");
getAbilityForField(doctor, MedicalTest_2, "update", "UserId");
getAbilityForField(doctor, MedicalTest_2, "update", "test");
getAbilityForField(doctor, MedicalTest_4, "update", "test");
console.groupEnd();

// ! USER
console.group(userDetails(user_1));
console.table(user_1.ability.rules);
getAbilityFor(user_1, MedicalTest_3, "read");
getAbilityFor(user_1, MedicalTest_4, "update");
getAbilityFor(user_1, MedicalTest_5, "delete");
getAbilityFor(user_1, MedicalTest_2, "update");
getAbilityForField(user_1, subject("User", user_1), "update", "role");
getAbilityForField(user_1, subject("User", user_1), "update", "password");
getAbilityForField(user_1, subject("User", user_2), "update", "password");
console.groupEnd();

// ! ANONYMOUS
console.group(userDetails(anonymous));
console.table(anonymous.ability.rules);
getAbilityFor(anonymous, MedicalTest_3, "read");
getAbilityFor(anonymous, MedicalTest_4, "update");
getAbilityFor(anonymous, MedicalTest_5, "delete");
getAbilityFor(anonymous, MedicalTest_2, "update");
console.log(
  "Can ANONYMOUS delete MedicalTest?",
  anonymous.ability.can("delete", "MedicalTest")
);
console.log(
  "Can ANONYMOUS create MedicalTest?",
  anonymous.ability.can("create", "MedicalTest")
);
console.log(
  "Can ANONYMOUS delete User?",
  anonymous.ability.can("delete", "User")
);
console.log(
  "Can ANONYMOUS create User?",
  anonymous.ability.can("create", "User")
);
console.groupEnd();

// * ===============================
// * Using CASL ForbiddenError
// * -------------------------------
ForbiddenError.setDefaultMessage(
  (error) =>
    `Authorization error: Not authorized for "${error.action}" on "${error.subjectType}"`
);

console.group("\nCASL ForbiddenError");
try {
  console.log("\nADMIN:");
  ForbiddenError.from(admin.ability).throwUnlessCan("delete", MedicalTest_5);
} catch (err) {
  console.log(err.message);
}

try {
  console.log("\nANONYMOUS:");
  ForbiddenError.from(anonymous.ability).throwUnlessCan(
    "delete",
    MedicalTest_5
  );
} catch (err) {
  console.log(err.message);
}

try {
  console.log("\nUSER:");
  ForbiddenError.from(user_1.ability).throwUnlessCan(
    "update",
    MedicalTest_3,
    "UserId"
  );
} catch (err) {
  console.log(err.message);
}

try {
  console.log("\nUSER:");
  ForbiddenError.from(user_1.ability).throwUnlessCan(
    "update",
    MedicalTest_3,
    "test"
  );
} catch (err) {
  console.log(err.message);
}

console.groupEnd();
