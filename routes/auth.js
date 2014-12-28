var express = require('express');
var controller = require('../controllers/auth');
var middleware = require('../middleware');

module.exports = express.Router()
	.post('/', controller.auth)
	.post('/logout', middleware.authUser, middleware.checkAccess, controller.logout)
	.get('/me', middleware.authUser, controller.me);