const router = require("express").Router();
const ctrl = require("../controllers/recordController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.post("/", auth, role("admin"), ctrl.create);
router.get("/", auth, ctrl.getAll);
router.put("/:id", auth, ctrl.update);
router.delete("/:id", auth, ctrl.remove);
module.exports = router;