const router = require("express").Router();
const ctrl = require("../controllers/authController");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new viewer user
 */
router.post("/register", ctrl.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 */
router.post("/login", ctrl.login);

module.exports = router;