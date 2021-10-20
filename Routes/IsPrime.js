const router = require("express").Router();

router.get("/", async (req, res) => {
  let num = parseInt(req.query.num);
  console.log(num);
  isPrime = true;
  setTimeout(() => res.json({ num, isPrime }), num);
});

module.exports = router;
