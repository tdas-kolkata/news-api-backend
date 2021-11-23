const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../Models/User");
const {sendWelcome} = require('../Util/sms/sendSms');

//@Route POST /register
//@access public
//@ cors *
//@desc to register new users

// const cookiesOptions = { maxAge: 1000 * 60 * 60 * 12, HttpOnly: true,SameSite:'strict' }

router.post("/", async (req, res) => {
  try {
    const user = req.body.user;
    //if the user name or email or cellno matches then this is an existing user
    const existingUser = await User.findOne({
      $or: [
        { username: user.username },
        { email: user.email },
        { cellno: user.cellno }
      ],
    });

    if(existingUser){
      res.status(403).json({msg:'Username or email or mobile no has already been taken'});
    }
    else{
      user.password =  await bcrypt.hash(user.password,10);
      const dbUser = new User({
        username:user.username,
        password:user.password,
        email:user.email,
        cellno:user.cellno
      });
      dbUser.save().then((data)=>{
        sendWelcome(data.cellno);
        res
        .cookie()
        .json({username:data.username,email:data.email});
      })
      .catch(()=>{
        res.status(400).json({msg:"Data is not saved bad requst"});
      });
      
    }

    // let data = JSON.stringify({ username, email, cellno, password });
    // const options = { maxAge: 1000 * 60 * 15, HttpOnly: true };
    // res
    //   .cookie("token", data, options)
    //   .json({ username, email, cellno, password });
  } catch (err) {
    res.sendStatus(400);
    console.log(err);
  }
});

module.exports = router;
