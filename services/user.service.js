const User = require("../models/user-schema")

const userService = {
  createUser: async(data) => {
    return await User.create(data)
  },

  updateUser: async(query, data) => {
    return await User.findOneAndUpdate(query, data)
  },

  deleteUser: async(query) => {
    return await User.findOneAndDelete(query)
  }
}

module.exports = userService;