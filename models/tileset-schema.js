const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectID = Schema.Types.ObjectId;

const TilesetSchema = new Schema(
    {
        owner: { type: ObjectID, ref: 'User', required: true },
        ownerUsername: { type: String, required: true },
        title: { type: String, required: true },
        tileSize: { type: Number , required: true },
        tags: { type: ObjectID, ref: 'Tag' },
        views: { type: Number },
        likedUsers: [{type: ObjectID, ref: 'User'}],
        dislikedUsers: [{type: ObjectID, ref: 'User'}],
        comments: [ {type: ObjectID, ref: 'Comment'} ],
        deleted: { type: Boolean },
        collaborators: [ {type: ObjectID, ref: 'User'} ],
        viewers: [ {type: ObjectID, ref: 'User'} ],
        public: { type: Boolean, default: false },
        image: { type: String },
        imageHeight: { type: Number },
        imageWidth: { type: Number },   
        tileCount: { type: Number }
    },
    { timestamps: true },
);

module.exports = mongoose.model('Tileset', TilesetSchema);