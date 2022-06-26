const mongoose = require("mongoose");

//Defining the post schema
const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: String,
  createdBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
//Exporting the model of post.
module.exports = new mongoose.model("Post", postSchema);
