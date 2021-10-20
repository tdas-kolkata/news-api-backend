const router = require("express").Router();
const News = require("../Models/News");

//@route POST /news/all
//@access public
//desc get all newes

router.get("/all", async (req, res) => {
  try{
    let news = await News.find({});
  res.send(news);
  }
  catch(err){
    res.send(err);
  }
});

module.exports = router;
