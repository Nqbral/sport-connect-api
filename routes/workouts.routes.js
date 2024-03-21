const router = require("express").Router();
const mongoose = require("mongoose");

const { isAuthenticated } = require("./../middleware/jwt.middleware.js");

const FeedPost = require("../models/FeedPosts.model");
const User = require("../models/Users.model");
const Workout = require("../models/Workouts.model");

// GET /api/workouts/owner - Retrieves the workouts of the authenticated user
router.get("/owner", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user._id;

    const workouts = await Workout.find({ create_user: userId })
      .populate("create_user", { _id: 0, name: 1 })
      .populate("exercises.exercise");

    res.status(200).json(workouts);
  } catch (error) {
    next(error);
  }
});

// GET /api/workouts/:workoutId - Retrieves a specific workout by id
router.get("/:workoutId", isAuthenticated, async (req, res, next) => {
  try {
    const { workoutId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(workoutId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    const workout = await Workout.findById(workoutId)
      .populate("create_user", { _id: 0, name: 1 })
      .populate("exercises.exercise");

    res.status(200).json(workout);
  } catch (error) {
    next(error);
  }
});

// POST /api/workouts - Create a new workout
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { name, exercises } = req.body;

    const createdWorkout = await Workout.create({
      create_user: userId,
      name: name,
      exercises: exercises,
    });

    await createFeedPost(
      req,
      `a créé un nouveau programme d'entraînement nommé ${name}.`,
      createdWorkout._id.toString()
    );

    res.status(201).json({ message: "Workout created", data: createdWorkout });
  } catch (error) {
    next(error);
  }
});

// PUT /api/workouts/:workoutId - Updates a specific workout by id
router.put("/:workoutId", isAuthenticated, async (req, res, next) => {
  try {
    const { workoutId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(workoutId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    const { name, exercises } = req.body;

    const editedWorkout = await Workout.findByIdAndUpdate(
      workoutId,
      {
        name: name,
        exercises: exercises,
      },
      { new: true }
    );

    await createFeedPost(
      req,
      `a mis à jour le programme d'entraînement nommé ${name}.`,
      workoutId
    );

    res.status(200).json({ message: "Workout edited", data: editedWorkout });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/workouts/:workoutId - Deletes a specific workout by id
router.delete("/:workoutId", isAuthenticated, async (req, res, next) => {
  try {
    const { workoutId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(workoutId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    const deletedWorkout = await Workout.findByIdAndDelete(workoutId);

    await createFeedPost(
      req,
      `a supprimé le programme d'entraînement nommé ${deletedWorkout.name}.`
    );

    const feedPostsLinkedToWorkout = await FeedPost.updateMany(
      { workout_linked: workoutId },
      { workout_linked: null }
    );

    res.status(200).json({ message: "Workout deleted", data: deletedWorkout });
  } catch (error) {
    next(error);
  }
});

// Create a feed post when creating/updating/deleting a workout
async function createFeedPost(req, message, workoutId = null) {
  const userId = req.user._id;

  const user = await User.findById(userId);

  await FeedPost.create({
    create_user: userId,
    message: `L'utilisateur ${user.name} ${message}.`,
    workout_linked: workoutId,
  });
}

module.exports = router;
