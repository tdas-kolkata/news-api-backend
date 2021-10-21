const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;


function verifyJWT(req, res, next) {
  if (req.headers["x-access-token"]) {
    const token = req.headers["x-access-token"].split(" ")[1];
    // console.log(`token received - ${token}`);
    if (token) {
      jwt.verify(token, secret,{algorithms:['HS256']}, (err, decoded) => {
        if (err) {
          console.log(`Error in verifyJWT - ${err}`);
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
      res.status(400).send("Missing Auth Header");
    }
  } else {
    res.status(400).send("Missing Auth Header");
  }
}

module.exports = verifyJWT;
