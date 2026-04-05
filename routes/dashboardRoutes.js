const router = require("express").Router();
const ctrl = require("../controllers/dashboardController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.get("/summary", auth, ctrl.summary);
router.get("/category", auth, ctrl.categoryTotals);
router.get("/trends", auth, ctrl.monthlyTrends);
module.exports = router;