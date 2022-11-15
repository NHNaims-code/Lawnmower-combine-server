const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId;

const commentSchema = mongoose.Schema({   
    message: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true
    },
    post: {
        type: ObjectId,
        ref: 'Post'
    },
    parent: {
        type: ObjectId,
        ref: 'Comment',
    },
    children: [
        {
            type: ObjectId,
            ref: 'Comment'
        }
    ],
    likes: [
        {
            type: String,            
        }
    ],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

module.exports =  mongoose.model('Comment', commentSchema)