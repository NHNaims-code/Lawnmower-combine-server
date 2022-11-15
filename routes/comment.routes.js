const commentController = require("../controllers/comment.controller")

const commentRoutes = async(app) => {
  
  app.get('/comment', (req, res) => {
    res.status(200).send('Hello, I am from comment route!')
  })

  app.post('/comment/create', async(req, res) => {
      console.log('hit', req.body)
      await commentController.createComment(req, res)
  })

  app.post('/comment/like', async(req, res) => {
      console.log('hit', req.body)
      await commentController.likeComment(req, res)
  })

  app.post('/comment/dislike', async(req, res) => {
      console.log('hit', req.body)
      await commentController.dislikeComment(req, res)
  })

  app.put('/comment/update/:id', async(req, res) => {
      console.log('hit', req.body)
      await commentController.updateComments(req, res)
  })

  app.delete('/comment/delete/:id', async(req, res) => {
      console.log('hit', req.body)
      await commentController.deleteComments(req, res)
  })

  app.get('/comment/all-comments', async(req, res) => {
      await commentController.getAllComments(req, res)
  })
}


module.exports = commentRoutes;