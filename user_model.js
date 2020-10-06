const Pool = require("pg").Pool;

const dotenv = require("dotenv").config({ path: "./.env" });
if (dotenv.error) {
  throw dotenv.error;
}

const pool = new Pool({
  // user: process.env.USER,
  // host: process.env.HOST,
  // database: process.env.DATABASE,
  password: process.env.PASSWORD,
  // port: process.env.PORT,
  user: "my_user",
  host: "localhost",
  database: "my_database",
  // password: "root",
  port: 5432,
});

// this function's just for testing
const getUsers = () => {
  return new Promise(function (resolve, reject) {
    pool.query("SELECT * FROM youdate ORDER BY id ASC;", (error, results) => {
      if (error) reject(error);
      resolve(results.rows);
    });
  });
};

// get one user by email
const getUser = (headers) => {
  const resBoi = new Promise(function (resolve, reject) {
    pool.query(
      "SELECT * FROM youdate WHERE email = $1;",
      [headers.email],
      (error, results) => {
        if (error) reject(error);
        if (results.rowCount !== 0) {
          console.log("came in true statement");
          // means one user with this email exists
          resolve(true);
        } else {
          console.log("came in false statement");
          // means new user so add to db
          resolve(false);
        }
      }
    );
  });
};

const insertUser = (body) => {
  return new Promise(function (resolve, reject) {
    const { name, age, email, photo, subscriptions, description } = body;

    pool.query(
      "INSERT INTO youdate (name, age, email, photo, accept_list, reject_list, subscriptions, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [name, age, email, photo, "{}", "{}", subscriptions, description],
      (error, results) => {
        if (error) reject(error);
        resolve(`A new user has been added: ${results.rows[0]}`);
      }
    );
  });
};

/* TODO: delete user */

module.exports = {
  getUsers,
  getUser,
  insertUser,
};
