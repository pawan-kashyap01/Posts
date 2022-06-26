require('dotenv/config');
const express = require('express');
const app =express();
const db = require('./db/connect')
const port = process.env.PORT ;
const path = require('path');
//using express.json() to recognize the incoming request object as a json object
app.use(express.json())

const postsRoute = require('./routes/posts')
const tagRoute = require('./routes/tag');
app.use('/tags',tagRoute)
app.use('/posts',postsRoute);

//for serving the images of post (as of now storing on local server)
app.use('/posts/postImage',express.static(path.join(__dirname, '../uploads/images')));
app.listen(port,()=>{
    console.log(`Listening to  port ${port}`);
})
