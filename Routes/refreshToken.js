const refreshRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const refreshSecret = process.env.JWT_REFRESH_SECRET;
const secret = process.env.JWT_SECRET;
const cookiesOptions = { maxAge: 1000 * 60 * 60 * 12, HttpOnly: true };

refreshRouter.post("/", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    jwt.verify(
      refreshToken,
      refreshSecret,
      { algorithms: ["HS256"] },
      async (err, decoded) => {
        if (err) {
          console.log(err);
          res.status(400).json({ err });
        } else {
          //if the refresh token is valid then check whether it matches with the user refrsh token saved in database
          //   console.log(decoded.id);
          //   console.log(refreshToken);
          const user = await User.findOne({ _id: decoded.id });

          if (user.refreshToken === refreshToken) {
            const payload = { id: decoded.id, username: decoded.username };
            const token = jwt.sign(payload, secret, {
              algorithm: "HS256",
              expiresIn: "1m",
            }); //token is generated
            const new_refresh_token = jwt.sign(payload, refreshSecret, {
              algorithm: "HS256",
              expiresIn: "30d",
            });
            user.refreshToken = new_refresh_token;
            user
              .save()
              .then((user) => {
                res.cookie("refreshToken", new_refresh_token, cookiesOptions); //refresh token is sent to user in an http only cookie
                res.status(200);
                res.json({ token });
              })
              .catch((err) => {
                res.status(400).json({
                  msg: "Some Error ...Not able to generate new token",
                });
              });
          } else {
            res
              .status(400)
              .json({ msg: "Refresh token is not matching with user refresh token" });
          }
        }
      }
    );
  } else {
    res.status(400).json({ msg: "Refrsh token not received" });
  }
});

module.exports = refreshRouter;
