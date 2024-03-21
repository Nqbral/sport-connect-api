const router = require("express").Router();

const { isAuthenticated } = require("./../middleware/jwt.middleware.js");

const User = require("../models/Users.model");

// GET /api/users/:username - Retrieves a specific user using the username and page
router.get("/:username", isAuthenticated, async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ name: username });

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
