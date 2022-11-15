const commentRoutes = require("./comment.routes");
const postRoutes = require("./post.routes");
const userRoutes = require("./user.routes");
const routes = async(app) => {
  userRoutes(app)
  commentRoutes(app)
  postRoutes(app)
}

module.exports = routes;