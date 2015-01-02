var _ = require('lodash');
var Comment = require('../models/comment');
var helpers = require('../core/helpers');

var controller = {
	getAll: function(req, res) {
		Comment.find({placeId: req.query.placeId}).sort({date: -1}).exec(helpers.simpleCollectionResponse(res));
	},
	create: function(req, res) {
		var data = _.pick(req.body, 'text', 'placeId');
		data.userId = req.getUser().getData().id;
		data.userName = req.getUser().getData().name;
		new Comment(data).save(helpers.simpleCreatedResponse(res));
	},
	delete: function(req, res) {
		var id = req.params.id;
		Comment.findById(id, checkOwner);

		function checkOwner(err, comment) {
			if (err) return res.status(500).json(err);
			if (!comment) return res.status(404);
			if (!req.getUser().getData().id === comment.userId) return res.status(403).end();
			Comment.findByIdAndRemove(id, helpers.simpleOkResponse(res));
		}
	}
};
module.exports = controller;