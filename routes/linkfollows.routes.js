const router = require("express").Router();
const mongoose = require("mongoose");

const { isAuthenticated } = require("./../middleware/jwt.middleware.js");

const LinkFollows = require("../models/LinkFollows.model");

// GET /api/linkfollows/owner - Retrieves the link follows of an user
router.get("/owner", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user._id;

    const linkFollows = await LinkFollows.find({
      followed_by: userId,
    }).populate("create_user", { name: 1 });

    res.status(200).json(linkFollows);
  } catch (error) {
    next(error);
  }
});

// GET /api/linkfollows/:followid - Retrieves the link follow of an user for a specific follow
router.get("/:followid", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { followid } = req.params;

    const linkFollows = await LinkFollows.findOne({
      follow: followid,
      followed_by: userId,
    });

    res.status(200).json(linkFollows);
  } catch (error) {
    next(error);
  }
});

// POST /api/linkfollows/:followid - Create a link between the user and an other user
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { followid } = req.body;

    if (!mongoose.Types.ObjectId.isValid(followid)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    const createdLinkFollow = await LinkFollows.create({
      follow: followid,
      followed_by: userId,
    });

    res
      .status(201)
      .json({ message: "LinkFollow created", data: createdLinkFollow });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/linkfollows/:id - Delete a link between the user and an other user
router.delete("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    const deletedLinkFollow = await LinkFollows.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: "LinkFollow deleted", data: deletedLinkFollow });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
