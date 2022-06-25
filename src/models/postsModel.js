const mongoose = require("mongoose");

//Defining the post schema
const postSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: String,
  desc: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 200 
  },
  
  comments: [{ body: String, date: Date }],
  date: { 
    type: Date,
    default: Date.now
   },
  is_private: Boolean,
});
//Exporting the model of post.
module.exports = new mongoose.model("Post", postSchema);
