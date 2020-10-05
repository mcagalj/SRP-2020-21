const { sequelize, User, MedicalTest } = require("./models");

async function assertDatabaseConnectionOk() {
  console.log(`Checking database connection...`);
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}

async function getUsers(options = {}) {
  const users = await User.findAll((options = {}));
  return users;
}

async function getUserByUsername(username, options = {}) {
  const user = await User.findOne({ ...options, where: { username } });
  return user;
}

async function getMedicalTests(options = {}) {
  const tests = await MedicalTest.findAll(options);
  return tests;
}

async function getMedicalTestsForUser(username = "") {
  let user = await getUserByUsername(username, {
    attributes: ["username"], // get only the username
    include: { model: MedicalTest, attributes: ["name", "result"] },
  });
  return user && user.MedicalTests ? user.MedicalTests : [];
}

function printMedicalTests({ username = null, tests }) {
  const results = tests.map((test) => ({
    username: !username ? test.User.username : username,
    result: test.result,
    name: test.name,
  }));
  // NOTE: table output requires Node.js version >=10.16.0
  console.table(results);
}

async function init() {
  // await assertDatabaseConnectionOk();

  // let user = await getUserByUsername("john");
  // console.log(user);

  // let user = await getUserByUsername("mirta");
  // console.log(user);

  let tests = await getMedicalTests({
    attributes: ["result", "name"],
    include: { model: User, attributes: ["username"] },
  });
  printMedicalTests({ tests });

  let username = "mirta";
  tests = await getMedicalTestsForUser(username);
  printMedicalTests({ username, tests });
}

init();
