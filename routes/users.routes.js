const router = require("express").Router();
const bcrypt = require("bcrypt");

const { isAuthenticated } = require("./../middleware/jwt.middleware.js");

const User = require("../models/Users.model");

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

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

// PUT /api/users/edit_informations - Edit user information (firstname, name, birthdate) of an user
router.put("/edit_informations", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { firstname, lastname, birthdate } = req.body;

    const editedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstname: firstname,
        lastname: lastname,
        birthdate: birthdate,
      },
      { new: true }
    );

    res.status(200).json({ message: "User edited", data: editedUser });
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/change_password - Edit user password of an user
router.put("/change_password", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { password, newPassword } = req.body;

    let user = await User.findById(userId);

    if (!bcrypt.compareSync(password, user.password)) {
      res.status(400).json({ message: "Ancien mot de passe incorrect" });
    }

    if (!PWD_REGEX.test(newPassword)) {
      res.status(400).json({
        message: "Veuillez saisir un nouveau mot de passe valide.",
      });
      return;
    }

    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    const editedUser = await User.findByIdAndUpdate(
      userId,
      {
        password: hashedPassword,
      },
      { new: true }
    );

    res.status(200).json({ message: "User edited", data: editedUser });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
