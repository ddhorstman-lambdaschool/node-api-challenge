const router = require("express").Router();
const actionRouter = require("./actionRouter");



router.use(
  "/:id/actions",
  (req, res, next) => {
    req.id = req.params.id;
    next();
  },
  actionRouter
);

module.exports = router;
