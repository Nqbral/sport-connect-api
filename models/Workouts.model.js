const { Schema, model } = require("mongoose");

const workoutSchema = new Schema({
  create_user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
  },
  exercises: [
    {
      type: {
        type: String,
        required: true,
      },
      exercise: {
        type: Schema.Types.ObjectId,
        ref: "Exercise",
      },
      nbSeries: {
        type: Number,
      },
      nbReps: {
        type: Number,
      },
      timeRest: {
        type: Number,
        required: true,
      },
    },
  ],
});

const Workout = model("Workout", workoutSchema);
module.exports = Workout;
