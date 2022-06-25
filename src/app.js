require('dotenv/config');
const { config } = require('dotenv');
const express = require('express');
const app =express();
const db = require('./db/connect')
const port = process.env.PORT || 3000;
app.use(express.json())

const postsRoute = require('./routes/posts')
app.use('/posts',postsRoute);

//using express.json() to recognize the incoming request object as a json object
app.get('/users', (req,res)=>{
    res.send("Hi Userss");
});


app.listen(port,()=>{
    console.log('Listening to  port 3000');
})
