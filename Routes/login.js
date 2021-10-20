const loginRouter = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = "okdoaskdsoaodkaosk";
const User = require("../Models/User");

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
              jwt.sign(payload, secret, { expiresIn: 86400 }, (err, token) => {
                if (err)
                  return res.json({ msg: "error in web token generation" });
                return res.json({
                  msg: "Success",
                  token: "Bearer " + token,
                });
              });
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
