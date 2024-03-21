const router = require("express").Router();

router.use("/auth", require("./auth.routes"));
router.use("/exercises", require("./exercises.routes"));
router.use("/workouts", require("./workouts.routes"));

module.exports = router;
