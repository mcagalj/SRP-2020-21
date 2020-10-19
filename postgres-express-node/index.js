const { sequelize, User, MedicalTest } = require("./models");
const {
  fieldEncryption,
  encrypt,
  decrypt,
} = require("./services/sequelize-field-encrypt");

const crypto = require("crypto");
const fs = require("fs");
const { ecb: cipher } = require("./services/ciphers");

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
  // user = await getUserByUsername("mirta");
  // console.log(user);
  // let tests = await getMedicalTests({
  //   attributes: ["result", "name"],
  //   include: { model: User, attributes: ["username"] },
  // });
  // printMedicalTests({ tests });
  // let username = "mirta";
  // tests = await getMedicalTestsForUser(username);
  // printMedicalTests({ username, tests });
  // try {
  //   let message = encrypt({
  //     key: Buffer.from(process.env.DB_FIELD_ENC_KEY, "base64"),
  //     plaintext: "test",
  //   });
  //   let decryptedMessage = decrypt({
  //     key: Buffer.from(process.env.DB_FIELD_ENC_KEY, "base64"),
  //     message,
  //   });
  //   console.table({
  //     plaintext: "test",
  //     encryptedMessage: message,
  //     decryptedMessage,
  //   });
  // } catch (error) {
  //   console.log(error.message);
  // }
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

  /**
   * * Message authentication (hash and MAC crypto functions)
   */
  try {
    const secret = "my supper secret";
    let message = "Authenticate this message.";

    let hmac = crypto.createHmac("sha256", secret); // ! Message authentication code
    let authTag = hmac.update(message).digest(); // ! Message digest/authentication code
    console.table([
      { message, "message digest/authentication tag": authTag.toString("hex") },
    ]);

    // * ===============================
    // * Example: Authenticating a file
    // *--------------------------------
    const CREATE_TAG = false;

    if (CREATE_TAG) {
      // * Authenticate the file

      const input = fs.createReadStream("test.txt");
      const output = fs.createWriteStream("test.tag");
      const hmac = crypto.createHmac("sha256", secret);

      hmac.update("text.txt"); // ! Protecting the file name
      input
        .pipe(hmac) // ! Protecting the file content
        .pipe(output)
        .on("finish", () => output.end());
    } else {
      // * Verify the file authenticity

      const input = fs.createReadStream("test.txt");
      const tag = fs.readFileSync("test.tag");
      const hmac = crypto.createHmac("sha256", secret); // ! Message authentication code

      hmac.update("text.txt");
      input.pipe(hmac).on("finish", () => {
        const isMessageAuthentic = crypto.timingSafeEqual(hmac.read(), tag); // ! Compare the auth tags
        console.log(
          `The file "test.txt" ${
            isMessageAuthentic ? "IS" : "IS NOT"
          } authentic.`
        );
      });
    }
  } catch (err) {
    console.log(err.message);
  }
}

init();

//--------------------------------
// Helper/utility functions
//--------------------------------
function increment(buffer) {
  for (let i = buffer.length - 1; i >= 0; i--) {
    if (buffer[i]++ !== 255) break;
  }
}
