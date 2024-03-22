const router = require("express").Router();

const { isAuthenticated } = require("./../middleware/jwt.middleware.js");

const FeedPost = require("../models/FeedPosts.model");
const LinkFollows = require("../models/LinkFollows.model");

// GET /api/feedposts/user/:userid&:page - Retrieves the posts of an user using its identifier
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

// GET /api/feedposts/:page - Retrieves the posts of an user and its subscription
// Sorted by create date desc
router.get("/:page", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { page } = req.params;

    const subscriptions = await LinkFollows.find({ followed_by: userId });

    let usersWhoCreatePost = [userId];

    subscriptions.forEach((subscription) =>
      usersWhoCreatePost.push(subscription.follow)
    );

    let perPage = 20;
    pageSelected = Math.max(0, page);

    const feedPosts = await FeedPost.find({
      create_user: { $in: usersWhoCreatePost },
    })
      .sort({ date: "descending" })
      .limit(perPage)
      .skip(perPage * pageSelected)
      .populate("create_user", { name: 1 });

    res.status(200).json(feedPosts);
  } catch (error) {
    next(error);
  }
});

// POST /api/feedposts/ - Create a new feedpost
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { message } = req.body;

    const createdFeedPost = await FeedPost.create({
      create_user: userId,
      message: message,
      workout_linked: null,
    });

    let returnedFeedPost = await FeedPost.findById(
      createdFeedPost._id
    ).populate("create_user", { name: 1 });

    res
      .status(201)
      .json({ message: "Feedpost created", data: returnedFeedPost });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
