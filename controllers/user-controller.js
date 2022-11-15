const userService = require("../services/user.service")

const userController = {
  createUser: async(req, res) => {
    console.log('new user: ', req.body)
    const newUser = await userService.createUser(req.body)
    res.status(200).send(newUser)
  }
}

module.exports = userController;