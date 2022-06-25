const express = require('express');
const router = express.Router();
const Post = require('../models/postsModel')

//Gets back all the posts
router.get('/',async (req,res)=>{
    try{
        const posts = await Post.find().limit(2);
        res.json(posts)
    }
    catch(err){
        res.send({errMsg:err})
    }
});

//Gets back a specific post by postId
router.get('/:postId',async (req,res)=>{
    console.log(req.params.postId);
    try{
        const post = await Post.findById(req.params.postId);
        res.send(post); 
    }catch(err){
        res.send({errMes:err})
    }
})

//Submits a post
router.post('/',(req,res)=>{
    console.log(req.body);
    const  post = new Post(req.body);
    post.save().then(()=>{
        res.status(201).send("Saved Successfully");
    }).catch((err)=>{
        res.status(400).send(err)
    })
});

// Delete a post
router.delete('/:postId', async (req,res)=>{
    try{
        const removedPost = await Post.deleteOne({_id: req.params.postId});
        res.json(removedPost)

    }catch(err){
        res.send(err)
    }
});

//Update a post 
router.patch('/:postId', async(req,res)=>{
    try{
        const updatedPost = await Post.updateOne({_id:req.params.postId},{$set:{title:req.body.title}});
        res.send(updatedPost);

    }
    catch(err){
        res.send(err)
    }
})

module.exports = router;