const mongoose = require('mongoose');

const tagSchema =  mongoose.Schema({
    tagName:{
        type:String,
        unique:true,
        required:true
    },
    desc:{
        type:String,        
    }
});

module.exports = new mongoose.model('Tag',tagSchema);