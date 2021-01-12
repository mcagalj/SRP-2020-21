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
const anonymous = null;

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

console.log(MedicalTest_1.__caslSubjectType__);

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
function defineAdminRules({ can }, user) {}
function defineDoctorRules({ can }, user) {}
function defineUserRules({ can }, user) {}
function defineAnonymousRules({ can }, user) {}

// * =============================
// *  CASL rules for user
// * -----------------------------
function defineRulesFor(user) {}

// * =============================
// *  CASL abilities for user
// * -----------------------------
function defineAbilityFor(user) {}
