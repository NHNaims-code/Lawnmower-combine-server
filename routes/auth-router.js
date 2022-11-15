const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/auth-controller')

router.get('/loggedIn', AuthController.loggedIn)
router.post('/login', AuthController.login)
router.post('/logout', AuthController.logout)
router.post('/register', AuthController.register)
router.put('/changePassword', AuthController.changePassword);
router.get('/verify', AuthController.verifyUserPassword);
router.put('/deleteAccount/', AuthController.deleteAccount)

module.exports = router