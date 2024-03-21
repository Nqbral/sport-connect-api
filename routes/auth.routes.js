const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { isAuthenticated } = require("./../middleware/jwt.middleware.js");

const User = require("../models/Users.model");
const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{4,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

// SignUp (POST)
router.post("/signup", async (req, res, next) => {
  const { name, password } = req.body;

  if (password === "" || name === "") {
    res.status(400).json({
      message: "Veuillez saisir un nom d'utilisateur et un mot de passe.",
    });
    return;
  }

  if (!USER_REGEX.test(name)) {
    res
      .status(400)
      .json({ message: "Veuillez saisir un nom d'utilisateur valide." });
    return;
  }

  if (!PWD_REGEX.test(password)) {
    res
      .status(400)
      .json({ message: "Veuillez saisir un mot de passe valide." });
    return;
  }

  User.findOne({ name })
    .then((foundUser) => {
      // If the user with the same email already exists, send an error response
      if (foundUser) {
        res.status(400).json({ message: "L'utilisateur existe déjà." });
        return;
      }

      // If email is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync();
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create the new user in the database
      // We return a pending promise, which allows us to chain another `then`
      return User.create({ name, password: hashedPassword });
    })
    .then((createdUser) => {
      // Deconstruct the newly created user object to omit the password
      // We should never expose passwords publicly
      const { name, _id } = createdUser;

      // Create a new object that doesn't expose the password
      const user = { name, _id };

      // Send a json response containing the user object
      // Generate token
      const token = jwt.sign(
        { userId: user._id, name: user.name },
        process.env.SECRET_KEY,
        { expiresIn: "3h" }
      );

      res.status(201).json({ user: user, token: token });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: "Erreur interne, veuillez réessayer plus tard" });
    });
});

// SignIn (POST)
router.post("/signin", async (req, res, next) => {
  const { name, password } = req.body;

  User.findOne({ name })
    .then((foundUser) => {
      if (!foundUser || !bcrypt.compareSync(password, foundUser.password)) {
        // If the user is not found or password not matching : send an error response
        res
          .status(401)
          .json({ message: "Erreur de combinaison utilisateur/mot de passe." });
        return;
      }

      const { _id, name } = foundUser;

      // Create an object that will be set as the token payload
      const payload = { _id, name };

      // Create and sign the token
      const token = jwt.sign(
        { userId: foundUser._id, name: foundUser.name },
        process.env.SECRET_KEY,
        { expiresIn: "3h" }
      );

      // Send the token as the response
      res.status(200).json({ user: foundUser, token: token });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: "Erreur interne, veuillez réessayer plus tard" });
    });
});

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get("/verify", isAuthenticated, (req, res, next) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and made available on `req.payload`
  console.log(`req.payload`, req.payload);

  // Send back the object with user data
  // previously set as the token payload
  res.status(200).json(req.payload);
});

module.exports = router;
