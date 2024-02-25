const mongoose = require("mongoose");

const retweetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "UserModel",
      required: true
    },
    tweetId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "TweetModel",
      required: true
    }
  },
  { timestamps: true }
);

const Retweet = mongoose.model("Retweet", retweetSchema);
module.exports = Retweet;