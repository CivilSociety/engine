var express = require('express');
var middleware = require('../middleware');
var helpers = require('../core/helpers');
var controller = require('../controllers/places')

module.exports = express.Router()
	.post('/', middleware.authUser, /*middleware.checkAccess,*/ controller.create)
	.get('/', middleware.authUser, controller.getAll)
	.get('/popular', middleware.authUser, controller.getPopular)
	.get('/:id', middleware.authUser, controller.getById)
	.put('/:id', middleware.authUser, controller.update)
	.put('/:id/vote', middleware.authUser, controller.vote)
	.post('/:id/comments', middleware.authUser, controller.addComment);