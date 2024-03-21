const router = require("express").Router();

const { isAuthenticated } = require("./../middleware/jwt.middleware.js");

const FeedPost = require("../models/FeedPosts.model");

// GET /api/feedposts/user/:userid&:page - Retrieves the workouts of an user using its identifier
// Sorted by create date desc
router.get("/user/:userid&:page", isAuthenticated, async (req, res, next) => {
  try {
    const { userid, page } = req.params;

    let perPage = 10;
    pageSelected = Math.max(0, page);

    const feedPosts = await FeedPost.find({ create_user: userid })
      .sort({ date: "descending" })
      .limit(perPage)
      .skip(perPage * pageSelected)
      .populate("create_user", { name: 1 });

    res.status(200).json(feedPosts);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
