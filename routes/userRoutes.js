const router = require("express").Router();
const ctrl = require("../controllers/userController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Admin creates user
 */
router.post("/", auth, role("admin"), ctrl.createUser);

module.exports = router;