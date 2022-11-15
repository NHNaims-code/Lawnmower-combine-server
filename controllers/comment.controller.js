const commentService = require("../services/comment.service");
const postService = require("../services/post.service");

const commentController = {
  createComment: async(data) => {
    try {
      const parent = data.parent || null

      const existPost = await postService.findOnePost({_id: data.post})
      const postComments = existPost.comments;

      const newComment = await commentService.createComment(data)
      
      if(parent){
        const parentComment = await commentService.findOneComment({_id: parent})
        const children = parentComment.children;
        children.push(newComment._id)

        const updatedParentComment = await commentService.updateOneComment({_id: parent}, {children: children})
        console.log(updatedParentComment)
      
        const updatedPost = await postService.findOnePost({_id: data.post})
        return updatedPost
        // res.status(200).send(newComment)        
      }else{
        const updatedPostComments = [...postComments, newComment._id]
        await postService.updatePost({_id: data.post}, {comments: updatedPostComments})
        const updatedPost = await postService.findOnePost({_id: data.post})
        return updatedPost
        // res.status(200).send(newComment)
      }
    } catch (error) {
      console.log(error)
      return error.message
      // res.status(401).send(error.message)
    }
  },


  getAllComments: async(req, res) => {
    try {
      const allComments = await commentService.getAllComments();
      // res.status(200).send(allComments)
    } catch (error) {
      console.log(error)
      // res.status(401).send(error.message)
    }
  },

  updateComments: async(query, data) => {
    try {
      return await commentService.updateOneComment(query, data);
      // res.status(200).send(updated)
    } catch (error) {
      console.log(error)
      // res.status(401).send(error.message)
    }
  },

  likeComment: async(data) => {
    try {
      const userName = data.user
      const commentID = data.comment

      console.log({userName}, {commentID})

      const existComment = await commentService.findOneComment({_id: commentID})
      if(existComment){
        const commentLikes = existComment.likes;
        console.log({commentLikes})
        const isAlreadyliked = commentLikes.filter(user => user == userName)
        


        if(isAlreadyliked.length == 0){
          const updatedLikes = [...commentLikes, userName]
          return await commentService.updateOneComment({_id: commentID}, {likes: updatedLikes})
          // res.status(201).send(updatedComment)
        }else{
          console.log('already liked')
          // res.status(200).send('already liked')
        }
      }

    } catch (error) {
      
    }
  },

  dislikeComment: async(data) => {
    try {
      const userName = data.user
      const commentID = data.comment

      console.log({userName}, {commentID})

      const existComment = await commentService.findOneComment({_id: commentID})
      if(existComment){
        const commentLikes = existComment.likes;
        console.log({commentLikes})
        const remainLikes = commentLikes.filter(user => user != userName)

        return await commentService.updateOneComment({_id: commentID}, {likes: remainLikes})
        // res.status(201).send(updatedComment)
        
      }

    } catch (error) {
      
    }
  },

  // dislikeComment: async(req, res) => {
  //   try {
  //     const userID = data.user
  //     const commentID = data.comment

  //     const existComment = await commentService.findOneComment({_id: commentID})
  //     console.log({existComment})
  //     if(existComment){
  //       const commentLikes = existComment.likes;
  //       const filterdLikes = commentLikes.filter(user => user != userID)
            
  //       const updatedComment = await commentService.updateOneComment({_id: commentID}, {likes: filterdLikes})
  //       console.log({updatedComment})
  //       // res.status(201).send(updatedComment)        
  //     }

  //   } catch (error) {
      
  //   }
  // },

  deleteComment: async(query) => {
    try {
      return await commentService.deleteComment(query);

    } catch (error) {
      console.log(error)

    }
  },

}

module.exports = commentController;