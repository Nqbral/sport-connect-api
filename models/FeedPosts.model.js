const { Schema, model } = require("mongoose");

const feedPostSchema = new Schema({
  create_user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: Date.now,
  },
  workout_linked: {
    type: Schema.Types.ObjectId,
    ref: "Workout",
  },
});

const FeedPost = model("FeedPost", feedPostSchema);
module.exports = FeedPost;
