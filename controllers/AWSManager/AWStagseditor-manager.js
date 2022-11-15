const { findOneAndDelete, findOneAndUpdate } = require('../../models/tags-schema');
const Tags = require('../../models/tags-schema');

module.exports.createTag = async (name) => {
    // Check to see if there is already an exisiting tag...
    const existingTag = await Tags.findOne( { name: name } ).catch(err => {
        return null;
    });
    if (!existingTag) { // Unique Tag...
        const newTag = new Tags({name: name});
        const createdTag = await newTag.save();
        return createdTag;
    } else { // Existing Tag, just return that...
        return existingTag;
    }
}

module.exports.deleteTag = async (tagId) => {
    return await Tags.findOneAndDelete({ _id: tagId }).catch(err => {return null;});
}

module.exports.getTag = async (tagId) => {
    return await Tags.findOne({ _id: tagId }).catch(err => {return null;});
}

module.exports.updateTag = async (updatedTagName, tagId) => {
    return await Tags.findOneAndUpdate({ _id: tagId }, {name: updatedTagName}, {new: true}).catch(err => {return null;});
}