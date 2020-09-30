require("dotenv").config();
const env = process.env.NODE_ENV || "development";

const config = require("./config/config")[env];
const Sequelize = require("sequelize");
const { User } = require("./models");

const sequelize = new Sequelize(config.url, config);

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

async function getUsers() {
  const users = await User.findAll();
  return users;
}

async function getUserByUsername(username) {
  const user = await User.findOne({ where: { username } });
  return user;
}

async function init() {
  await assertDatabaseConnectionOk();

  let user = await getUserByUsername("john");
  console.log(user);

  user = await getUserByUsername("mirta");
  console.log(user);
}

init();
