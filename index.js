// const dotenv = require("dotenv").config({ path: "./.env" });

const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

const merchant_model = require("./merchant_model");
const user_model = require("./user_model");

// if (dotenv.error) {
//   throw dotenv.error;
// }
app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers"
  );
  next();
});

app.get("/", (req, res) => {
  user_model
    .getUsers()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.get("/userbyemail", (req, res) => {
  user_model
    .getUser(req.headers)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.post("/newuser", (req, res) => {
  // if (req.body.email)
  // if can find this email alr in the db, cancel req
  user_model
    .insertUser(req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.get("/subs", (req, res) => {
  console.log("authStr: ", req.headers.authStr);
  const channelIds = fetch(process.env.GOOGLE_API_URL, {
    method: "GET",
    headers: {
      Authorization: req.headers.authStr,
    },
  })
    .then((response) => {
      console.log(response);
      return response; // going to need to parse for just channel ids
    })
    .catch((err) => {
      console.log(err);
    });
  res.status(200).send(channelIds);
});

app.post("/merchants", (req, res) => {
  merchant_model
    .createMerchant(req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.delete("/merchants/:id", (req, res) => {
  merchant_model
    .deleteMerchant(req.params.id)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
