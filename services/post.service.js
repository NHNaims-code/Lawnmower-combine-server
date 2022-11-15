const Post = require("../models/post-schema")

const postService = {
  createPost: async(data) => {
    return await Post.create(data)
  },

  findOnePost: async(query) => {
    return await Post.findOne(query)
  },

  getAllPost: async() => {
    return await Post.find({}).populate({
      path: 'comments', model: 'Comment',
      populate: {
        path: 'children', model: 'Comment',
        populate: {
          path: 'children', model: 'Comment',
          populate: {
            path: 'children', model: 'Comment',
            populate: {
              path: 'children', model: 'Comment',
              populate: {
                path: 'children', model: 'Comment',
                populate: {
                  path: 'children', model: 'Comment',
                },
              },
            },
          },
        },
      },
      
    })
  },

  updatePost: async(query, data) => {
    return await Post.findOneAndUpdate(query, data)
  },

  deletePost: async(query) => {
    return await Post.findOneAndDelete(query)
  }
}

module.exports = postService;