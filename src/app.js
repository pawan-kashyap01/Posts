require('dotenv/config');
const express = require('express');
const app =express();
const db = require('./db/connect')
const port = process.env.PORT || 3000;
//using express.json() to recognize the incoming request object as a json object
app.use(express.json())

const postsRoute = require('./routes/posts')
const tagRoute = require('./routes/tag');
app.use('/tags',tagRoute)
app.use('/posts',postsRoute);

app.listen(port,()=>{
    console.log('Listening to  port 3000');
})
