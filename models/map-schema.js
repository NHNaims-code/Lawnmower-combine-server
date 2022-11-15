const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const MapSchema = new Schema(
    {
        owner: { type: ObjectId, ref: 'User', required: true },
        ownerUsername: { type: String, required: true },
        title: { type: String, required: true },
        creationDate: { type: String },
        tags: { type: [{type: ObjectId, ref: 'Tag'}] },
        views: { type: Number},
        likedUsers: { type: [{type: ObjectId, ref: 'User'}] },
        dislikedUsers: { type: [{type: ObjectId, ref: 'User'}] },
        comments: { type: [{type: ObjectId, ref: 'Comment'}] },
        deleted: { type: Boolean },
        collaborators: { type: [{ type: ObjectId, ref: 'User'}] },
        viewers: { type: [{ type: ObjectId, ref: 'User'}] },
        public: { type: Boolean, default: false },
        tilesets: { type: [{ type: ObjectId, ref: 'Tileset'}] },
        height: { type: Number, required: true},
        width: { type: Number, required: true},
        tileSize: { type: Number, required: true},
        layers:{ type: [{type: ObjectId, ref: 'Layer'}] },
    },
    { timestamps: true }
);
module.exports = mongoose.model('Map', MapSchema);