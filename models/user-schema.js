const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        joinDate: { type: Date, default: Date.now },
        maps: [{ type: ObjectId, ref: 'Map' }],
        tilesets: [{ type: ObjectId, ref: 'Tileset' }],
        comments: [{ type: ObjectId, ref: 'Comment' }],
        key: { type: String },
        changingPassword: { type: String, default: "" }
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);