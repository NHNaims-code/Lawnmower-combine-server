const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId;

const likeSchema = mongoose.Schema({   
    user: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Like', likeSchema)