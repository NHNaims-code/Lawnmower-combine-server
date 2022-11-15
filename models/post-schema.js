const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId;

const likeSchema = mongoose.Schema({   
    user: {
        type: String,
        required: true
    },

    // post_image: {
    //   type: String,
    //   required: true
    // },

    title: {
      type: String,
      required: true
    },
    

    comments: [{
        type: ObjectId,
        ref: 'Comment'
    }],

    likes: [
      {
        type: String,
      }
    ],

    views: [
      {
        type: String,
      }
    ]
}, {
    timestamps: true
})

module.exports = mongoose.model('Like', likeSchema)