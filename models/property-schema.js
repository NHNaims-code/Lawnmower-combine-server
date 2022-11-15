const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PropertySchema = new Schema(
    {
        name: { type: String, required: true },
        type: { type: String, default: 'Boolean' },
        value: { type: String, default: 'false' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Property', PropertySchema);