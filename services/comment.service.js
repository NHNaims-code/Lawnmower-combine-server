const Comment = require("../models/comment-schema");

const commentService = {
  createComment: async(data) => {
    return await Comment.create(data)
  },

  findOneComment: async(query) => {
    return await Comment.findOne(query)
  },

  updateOneComment: async(query, data) => {
    return await Comment.findOneAndUpdate(query, data);
  },

  deleteComment: async(query) => {
    return await Comment.updateOne(query, {
      isDeleted: true
    })
  },

  getAllComments: async() => {
    return await Comment.find({})
      .populate({
        path: 'children', model: 'Comment',
        populate: {
          path: 'children', model: 'Comment',
        },
        populate: {
          path: 'children', model: 'Comment',
        },        
      })
        
  }
}

module.exports = commentService;