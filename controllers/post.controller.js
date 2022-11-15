const postService = require("../services/post.service");

const postController = {
  createPost: async(req, res) => {
    console.log('new post data: ', req.body)
    const newPost = await postService.createPost(req.body)
    res.status(200).send(newPost)
  },
  getAllPost: async(req, res) => {
    const allPost = await postService.getAllPost()
    res.status(200).send(allPost)
  },

  // for socket.io
  getPosts: async(req, res) => {
    return await postService.getAllPost()
  },

  createView: async(req, res) => {

    console.log('hit')
    const postID = req.body.post;
    const userName = req.body.user;

    const existPost = await postService.findOnePost({_id: postID})

    if(existPost){
      const existViews = existPost.views;

      let isViewExist = false;
      existViews.map(user => {
        if(user == userName){
          isViewExist = true;
        }
      })

      if(!isViewExist){
        const updatedViews = [...existViews, userName]
        const updatedPost = await postService.updatePost({_id: postID}, {views: updatedViews})

        res.status(200).send(updatedPost)
      }
    }
  },
  
  postLike: async(data) => {
    const userName = data.user
    const postID = data.post

    const existPost = await postService.findOnePost({_id: postID})

    if(existPost){
      const postLikes = existPost.likes;

      let isLiked = false
      postLikes.map(user => {
        console.log("user: ", user, " userName: ", userName)
        if(user == userName){
          isLiked = true;
        }
      })

      if(!isLiked){
        const updatedPostLikes = [...postLikes, userName]
        return await postService.updatePost({_id: postID}, {likes: updatedPostLikes})
      }
    }
  },

  postDislike: async(data) => {
    const userName = data.user
    const postID = data.post

    const existPost = await postService.findOnePost({_id: postID})

    if(existPost){
      const postLikes = existPost.likes;

      const raminLikes = postLikes.filter(user => user =! userName)

      return await postService.updatePost({_id: postID}, {likes: raminLikes})
      
    }
  }
}

module.exports = postController;