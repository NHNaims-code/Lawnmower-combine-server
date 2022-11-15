const postController = require("../controllers/post.controller")

const postRoutes = async(app) => {

  app.post('/post/create', async(req, res) => {
      console.log('hit', req.body)
      await postController.createPost(req, res)
  })

  app.get('/post/get-all', async(req, res) => {
      console.log('hit', req.body)
      await postController.getAllPost(req, res)
  })

  app.post('/post/createView', async(req, res) => {
      console.log('hit', req.body)
      await postController.createView(req, res)
  })

}


module.exports = postRoutes;