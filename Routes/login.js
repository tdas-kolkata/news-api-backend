const loginRouter = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;
const User = require("../Models/User");

// @ POST /login
// @access public
// desc - In this module user pasword is verified and acccess token is generated and send to the user and refreshtoken
// is generated and send to user and also save is user collection for future reference

const cookiesOptions = { maxAge: 1000 * 60 * 60 * 12, HttpOnly: true};

loginRouter.post("/", async (req, res) => {
  const loginUser = req.body.user;
  User.findOne({ username: loginUser.username })  //pulling existing record based on the username
    .then((dbUser) => {
      if (!dbUser) {
        sendInvalid(res);                         //if the user does not exist then send 400
      } else {
        bcrypt
          .compare(loginUser.password, dbUser.password)   // check the password matches with database
          .then((isCorrect) => {
            if (isCorrect) {                              // if the password matches
              const payload = {
                id: dbUser._id,
                username: dbUser.username,
              };
              const token = jwt.sign(payload,secret, { algorithm: 'HS256',expiresIn: '1d' });  //token is generated
              const refresh_token = jwt.sign(payload,refreshSecret, { algorithm: 'HS256',expiresIn: '30d' });  //refresh token is generated
              dbUser.refreshToken = refresh_token;        // refresh token is saved to the particular user
              dbUser.save().then(user=>{
                // res.cookie('refreshToken',refresh_token,cookiesOptions);   //refresh token is sent to user in an http only cookie 
                res.status(200);                                            
                res.json({token});                                        //jwt token is send as json payload
              })
              .catch(err=>{
                  console.log(err);
                  sendInvalid(res);                                   //if the server fails to store refresh token then invalid response
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
