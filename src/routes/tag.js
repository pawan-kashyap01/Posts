const express = require("express");
const router = express.Router();

const Tag = require("../models/tagModel");
const tagPostMapModel = require("../models/tagPostMapModel");
//Gives the tags and posts for a given tag(if includePosts is provided true in query params).
router.get("/", async (req, res) => {
  try {
    const tags = await Tag.find();
    if (req.query.includePosts) {
      let tagsWithPosts = [];
      for (let t of tags) {
        let tag = JSON.parse(JSON.stringify(t));
        let posts = await tagPostMapModel.find(
          { tagId: tag._id, isEnabled: true },
          { _id: 1, postId: 1 }
        );
        tag.posts = posts;
        tagsWithPosts.push(tag);
      }
      res.json(tagsWithPosts);
    } else res.json(tags);
  } catch (err) {
    res.send({ error: err });
  }
});

//Creates a new Tag
router.post("/", async (req, res) => {
  try {
    const tag = new Tag(req.body);
    const createdTag = await Tag.create(tag);
    res.send({ success: true, tag: createdTag});
  } catch (err) {
    res.send({ success: false, error: err });
  }
});

//Updates a tag
router.patch("/:postId",async (req,res)=>{
    try{
        const updatedTag = await Tag.updateOne({_id:req.params.postId},{$set:req.body});
        res.send(updatedTag)
    }catch(err){
        res.send({success: false,error: err});
    }
})

module.exports = router;
