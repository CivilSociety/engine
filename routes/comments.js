var express = require('express');
var middleware = require('../middleware');
var helpers = require('../core/helpers');
var controller = require('../controllers/comments')

module.exports = express.Router()
	.get('/', controller.getAll)
	.post('/', middleware.authUser, middleware.checkAccess, controller.create);