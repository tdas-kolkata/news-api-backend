const jwt = require("jsonwebtoken");
const secret = "okdoaskdsoaodkaosk";

function verifyJWT(req, res, next) {
  if (req.headers["x-access-token"]) {
    const token = req.headers["x-access-token"].split(" ")[1];
    if (token) {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return res.status(400).send({
            msg: "Failed to authenticate",
          });
        } else {
          req.user = {};
          req.user.id = decoded.id;
          req.user.username = decoded.username;
          next();
        }
      });
    } else {
      res.status(400).send("Mission Auth Header");
    }
  } else {
    res.status(400).send("Mission Auth Header");
  }
}

module.exports = verifyJWT;
