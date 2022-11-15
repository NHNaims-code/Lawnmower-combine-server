const express = require('express')
const app = express()
const http = require('http')
const { Server } = require("socket.io")

// initializing dotenv
require('dotenv').config()
const port = process.env.PORT

const connectToDatabase = require('./mongodb/start.mongodb')
const routes = require('./routes')

// connect to the mongodb database
connectToDatabase();

const bodyParser = require('body-parser')
const cors = require('cors')
const commentController = require('./controllers/comment.controller')
const postController = require('./controllers/post.controller')
const commentService = require('./services/comment.service')

app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST"]
  }
})

io.on('connection', server => {
  console.log('User connected', server.id)
  
  
  server.on('send_comment', async(data) => {
    console.log(data)
    const result = await commentController.createComment(data)

    const posts = await postController.getPosts()
    server.broadcast.emit('updated_post', posts)
    server.emit('updated_post', posts)
  })

  server.on('edit_comment', async(data) => {

    await commentController.updateComments({_id: data.comment}, {message: data.message})

    const posts = await postController.getPosts()
    server.broadcast.emit('updated_post', posts)
    server.emit('updated_post', posts)
  })

  server.on('comment_like', async(data) => {
    await commentController.likeComment(data)

    const posts = await postController.getPosts()
    server.broadcast.emit('updated_post', posts)
    server.emit('updated_post', posts)
  })

  server.on('comment_dislike', async(data) => {
    await commentController.dislikeComment(data)

    const posts = await postController.getPosts()
    server.broadcast.emit('updated_post', posts)
    server.emit('updated_post', posts)
  })

  server.on('comment_delete', async(data) => {
    await commentController.deleteComment({_id: data.comment})

    const posts = await postController.getPosts()
    server.broadcast.emit('updated_post', posts)
    server.emit('updated_post', posts)
  })

  server.on('post_like', async(data) => {
    console.log('hit')
    console.log({data})
    await postController.postLike(data)

    const posts = await postController.getPosts()
    server.broadcast.emit('updated_post', posts)
    server.emit('updated_post', posts)
  })

  server.on('post_dislike', async(data) => {
    console.log('hit')
    console.log({data})
    await postController.postDislike(data)

    const posts = await postController.getPosts()
    server.broadcast.emit('updated_post', posts)
    server.emit('updated_post', posts)
  })
})

// common middleware
app.use('/public', express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({  extended: false }));
app.use(express.json());
app.use(cors({
    origin: true,
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD','PATCH', 'DELETE'],
    credentials: true
}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST,PATCH');
    res.header("Access-Control-Allow-Headers", "Content-Type , Authorization");
    next();
});
app.use(function (err, req, res, next) {
    console.error(err.message)
    if (!err.statusCode) err.statusCode = 500
    res.status(err.statusCode).send(err.message || 'Something went wrong')
  })

// setup all routes
routes(app)


app.use('*', (req, res) => {
  res.status(404).send('route not found!')
})


server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})