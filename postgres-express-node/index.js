const { sequelize, User, MedicalTest } = require("./models");
const {
  fieldEncryption,
  encrypt,
  decrypt,
} = require("./services/sequelize-field-encrypt");

const crypto = require("crypto");
const fs = require("fs");
const { ecb: cipher } = require("./services/ciphers");
const jwt = require("jsonwebtoken");

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
  /**
   * * Message authentication (hash and MAC crypto functions)
   */
  try {
    // * ========================
    // *  Generate token
    // * ------------------------
    const secret = "my supper secret";
    let message = { message: "Authenticate this message." };

    // * Default token
    let token = jwt.sign(message, secret);
    let decodedToken = jwt.decode(token);
    console.log("\nDecoded token:", decodedToken); // * Return only payload
    console.log("Token:", token);

    // * Token with expiration time of 1h
    token = jwt.sign(message, secret, { expiresIn: "1h" });
    decodedToken = jwt.decode(token, { complete: true }); // * Include all parts
    console.log("\nDecoded token (complete):", decodedToken);
    console.log("Token:", token);

    // * ========================
    // *  Verify token
    // * ------------------------
    console.log("\n");
    // token = token.replace("e", "f"); // ! Try to change a part of the token
    // console.log(token);
    decodedValidatedToken = await verifyJwt({ secret, token });
    console.log("Validated token:", decodedValidatedToken);
  } catch (err) {
    console.log(err.message);
  }
}

init();

/**
 * Promisfied JWT verification
 * @param {*} token
 */
function verifyJwt({ token, secret }) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        return reject({ error: error.message });
      }
      resolve(decoded);
    });
  });
}
