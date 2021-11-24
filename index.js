const express = require("express");
// const config = require("config");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongo_uri = process.env.MONGO_URI;

const app = express();

const verifyJWT = require('./Middlewares/auth')

app.use('/',express.static('build'));

app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());

app.use("/home", require("./Routes/user"));
app.use("/test", cors(),require("./Routes/IsPrime"));
app.use("/news",cors(),verifyJWT, require("./Routes/newsRouter"));  //verifyJWT
app.use("/register",cors(), require("./Routes/register"));
app.use("/login",cors(), require("./Routes/login"));
app.use("/refresh_token",cors(), require("./Routes/refreshToken"));

app.get("/", async (req, res) => {
  res.send("Home");
});

const port = process.env.PORT;
mongoose
  .connect(mongo_uri) //connect to mongo db first then start the web server
  .then(() => {
    console.log("Connected to mongo db");
    app.listen(port, () => console.log(`server running...at ${port}`));
  })
  .catch((err) => {
    console.log(err);
    throw err;
  });
