const router = require('express').Router();


//@route user
//@desc all users

router.get('/',async(req,res)=>{
    res.send('user');
})


module.exports = router;
