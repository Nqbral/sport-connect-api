const router = require("express").Router();
const mongoose = require("mongoose");

const { isAuthenticated } = require("./../middleware/jwt.middleware.js");

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

    res.status(200).json({ message: "Workout deleted", data: deletedWorkout });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
