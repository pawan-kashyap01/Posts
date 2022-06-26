const mongoose = require('mongoose');

const mapSchema = mongoose.Schema({
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        required : true
    },
    tagId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    createdBy:{
        type:String,
    },
    isEnabled:{
        type:Boolean,
        default: true
    }
})

module.exports = new mongoose.model('postTagMap', mapSchema)