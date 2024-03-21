const router = require("express").Router();

const { isAuthenticated } = require("./../middleware/jwt.middleware.js");

const Exercise = require("../models/Exercises.model");

router.get("/", isAuthenticated, (req, res, next) => {
  Exercise.find()
    .sort({ name: 1 })
    .then((allExercises) => res.json(allExercises))
    .catch((err) => res.json(err));
});

module.exports = router;
