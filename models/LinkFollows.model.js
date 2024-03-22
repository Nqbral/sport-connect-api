const { Schema, model } = require("mongoose");

const linkFollowSchema = new Schema({
  follow: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  followed_by: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const LinkFollow = model("LinkFollow", linkFollowSchema);
module.exports = LinkFollow;
