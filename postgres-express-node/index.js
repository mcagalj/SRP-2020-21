const { sequelize, User, MedicalTest } = require("./models");
const {
  fieldEncryption,
  encrypt,
  decrypt,
} = require("./services/sequelize-field-encrypt");

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
  await assertDatabaseConnectionOk();

  // let user = await getUserByUsername("john");
  // console.log(user);
  // user = await getUserByUsername("mirta");
  // console.log(user);

  let tests = await getMedicalTests({
    attributes: ["result", "name"],
    include: { model: User, attributes: ["username"] },
  });
  printMedicalTests({ tests });

  let username = "mirta";
  tests = await getMedicalTestsForUser(username);
  printMedicalTests({ username, tests });

  try {
    let message = encrypt({
      key: Buffer.from(process.env.DB_FIELD_ENC_KEY, "base64"),
      plaintext: "test",
    });

    let decryptedMessage = decrypt({
      key: Buffer.from(process.env.DB_FIELD_ENC_KEY, "base64"),
      message,
    });

    console.table({
      plaintext: "test",
      encryptedMessage: message,
      decryptedMessage,
    });
  } catch (error) {
    console.log(error.message);
  }

  // const { id } = await getUserByUsername("john", { attributes: ["id"] });
  // if (id) {
  //   let newTest = MedicalTest.build({
  //     UserId: id,
  //     name: "HIV",
  //     result: `negative`,
  //     // result: JSON.stringify({ result: "negative", user: "john", id }),
  //   });

  //   newTest = await newTest.save();
  //   console.log(newTest.toJSON());
  // }

  // tests = await getMedicalTestsForUser("john");
  // printMedicalTests({ username: "john", tests });
}

init();
