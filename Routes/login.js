const loginRouter = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;
const User = require("../Models/User");


const cookiesOptions = { maxAge: 1000 * 60 * 60 * 12, HttpOnly: true,SameSite:'strict' };

loginRouter.post("/", async (req, res) => {
  const loginUser = req.body.user;
  User.findOne({ username: loginUser.username })
    .then((dbUser) => {
      if (!dbUser) {
        sendInvalid(res);
      } else {
        bcrypt
          .compare(loginUser.password, dbUser.password)
          .then((isCorrect) => {
            if (isCorrect) {
              const payload = {
                id: dbUser._id,
                username: dbUser.username,
              };
              const token = jwt.sign(payload,secret, { algorithm: 'HS256',expiresIn: '1d' });
              const refresh_token = jwt.sign(payload,refreshSecret, { algorithm: 'HS256',expiresIn: '30d' });
              res.json({token,refresh_token});
            } else {
              sendInvalid(res);
            }
          })
          .catch((err) => {
            console.log(err);
            sendInvalid(res);
          });
      }
    })
    .catch();
});

function sendInvalid(res) {
  res.status(400).send("Invalid Username and password");
}

module.exports = loginRouter;
