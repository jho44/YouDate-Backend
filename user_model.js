const Pool = require("pg").Pool;

// var url = process.env.DATABASE_URL;
// console.log(url);
// url = url.split(/(\/\/)|\/|:|@/g);
// var user = url[4],
//   host = url[8],
//   database = url[12],
//   password = url[6],
//   port = url[10];

const pool = new Pool({
  // user: user,
  // host: host,
  // database: database,
  // password: password,
  // port: port,
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
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
