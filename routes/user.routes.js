const userController = require('../controllers/user-controller')

const userRoutes = async(app) => {
  
  app.get('/user', (req, res) => {
    res.status(200).send('Hello, I am from user route!')
  })

  app.post('/user/create', async(req, res) => {
    try {
      await userController.createUser(req, res)

    } catch (error) {
      console.log(error)
      res.status(401).send(error)
    }
  })
}


module.exports = userRoutes;