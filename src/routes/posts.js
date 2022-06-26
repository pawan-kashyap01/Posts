require("dotenv/config");
const { json } = require("express");
const express = require("express");
const router = express.Router();
const Post = require("../models/postsModel");
const tagPostMapModel = require("../models/tagPostMapModel");
const Tag = require("../models/tagModel");

const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: "uploads/images/",
  filename: (req, file, cb) => {
    return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage: storage });
//Creates a new post (& tags if given)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    req.body.tags = req.body.tags.substring(1, req.body.tags.length - 1).split(",");
    req.body.image = `http://localhost:${process.env.PORT}/posts/postImage/${req.file.filename}`;
    const post = new Post(req.body);
    const savedPost = await Post.create(post);
    if (req.body.tags) {
      for (tag of req.body.tags) {
        const tagExist = await Tag.findById(tag);
        if (tagExist) {
          await tagPostMapModel.create({
            tagId: tag,
            postId: savedPost._id,
            cretedBy: savedPost.cretedBy,
          });
        }
      }
    }
    res.status(201).send(savedPost);
  } catch (err) {
    res.status(400).send({ success: false, error: err });
  }
});

//Gets back all the posts || filtered posts || pagination
router.get("/", async (req, res) => {
  let filter = req.query;
  filter.isDeleted = false;
  if (req.query.skip) {
    var offset = req.query.skip;
    delete filter.skip;
  }
  if (req.query.limit) {
    var limit = req.query.limit;
    delete filter.limit;
  }

  try {
    let posts;
    if (limit) {
      posts = await Post.find(filter)
        .sort([["createdAt", -1]])
        .skip(offset | 0)
        .limit(limit);
    } else {
      posts = await Post.find(filter)
        .sort([["createdAt", -1]])
        .skip(offset | 0);
    }
    let postsWithTags = [];
    for (let p of posts) {
      let post = JSON.parse(JSON.stringify(p));
      const tag = await tagPostMapModel.find(
        { postId: post._id, isEnabled: true },
        { _id: 1, tagId: 1 }
      );

      post.tags = tag;
      postsWithTags.push(post);
    }
    res.send(postsWithTags);
  } catch (err) {
    res.send({ errMsg: err });
  }
});

//Gets posts using tags
router.get("/getPostsByTag/:tagId", async (req, res) => {
  try {
    const posts = await tagPostMapModel.find(
      { tagId: req.params.tagId },
      { _id: 1, postId: 1 }
    );
    res.send(posts);
  } catch (err) {
    res.send({ error: err });
  }
});

//Gets posts using tags
router.get("/searchPosts", async (req, res) => {
  try {
    const posts = await Post.find({
      $or: [
        {
          title: {
            $regex: req.query.keyword,
          },
        },
        {
          desc: {
            $regex: req.query.keyword,
          },
        },
      ],
    });
    res.send(posts);
  } catch (err) {
    res.send({ error: err });
  }
});

//Gets back a specific post by postId
router.get("/:postId", async (req, res) => {
  try {
    filter = {
      _id: req.params.postId,
      isDeleted: false,
    };
    const post = await Post.find(filter);
    res.send(post);
  } catch (err) {
    res.send({ errMes: err });
  }
});

// Delete a post - we are doing the soft delete
router.delete("/:postId", async (req, res) => {
  try {
    const deletedPost = await Post.updateOne(
      { _id: req.params.postId },
      { $set: { isDeleted: true } }
    );
    if (!deletedPost.modifiedCount) {
      res.status(404).send({ remarks: "No Post for the given postId." });
    } else {
      await tagPostMapModel.updateMany(
        { postId: req.params.postId },
        { $set: { isEnabled: false } }
      );
      res.send({ success: true });
    }
  } catch (err) {
    res.send({ error: err });
  }
});

//Update a post
router.patch("/:postId", async (req, res) => {
  try {
    Object.keys(req.body).forEach((key) => {
      if (!["title", "desc", "isPrivate"].includes(key)) {
        delete req.body[key];
      }
    });
    const updatedPost = await Post.updateOne(
      { _id: req.params.postId },
      { $set: req.body }
    );
    res.send(updatedPost);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
