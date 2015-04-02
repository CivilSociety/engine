var _ = require('lodash');
var Place = require('../models/place');
var helpers = require('../core/helpers');

var controller = {
	getAll: function(req, res) {
		var userId = req.getUser().getData().id;
		var order = req.query.order;
		var sort = {
			created_at: -1
		};
		if (order === 'votes') {
			sort = {
				votes: -1
			}
		}
		Place.find().sort(sort).exec(function(err, places) {
			res.json(places.map(formatPlace));
		});
		function formatPlace(place) {
			var data = _.omit(place.toJSON(), 'votedUsers', '__v', '_id');
			data.canVote = false;
			data.id = place._id;
			if (userId && place.votedUsers.indexOf(userId) === -1) {
				data.canVote = true;
			}
			return data;
		}
	},
	getPopular: function(req, res) {
		Place.find().sort({votes: -1}).exec(helpers.simpleCollectionResponse(res));
	},
	getById: function(req, res) {
		var id = req.params.id;
		var userId = req.getUser().getData().id;
		Place.findById(id, function(err, place) {
			var data = _.omit(place, 'votedUsers');
			data.canVote = false;
			if (place.votedUsers.indexOf(userId) > -1) {
				data.canVote = true;
			}
			res.json(data);
		});
	},
	create: function(req, res) {
		var data = _.pick(req.body, 'improvement', 'description', 'latlng');
		data.name = req.getUser().getData().name;
		var sub = new Place(data);
		sub.save(helpers.simpleCreatedResponse(res));
	},
	vote: function(req, res) {
		var id = req.params.id;
		var userId = req.getUser().getData().id;
		Place.findByIdAndUpdate(id, { $inc: { votes: 1 }, $push: {votedUsers: userId}}, helpers.simpleObjectResponse(res));
	},
	update: function(req, res) {
		var id = req.params.id;
		var data = _.pick(req.body, 'name', 'improvement', 'description', 'latlng');
		Place.findById(id, update);

		function update(err, sub) {
			if (err) return res.status(500).json(err);
			if (!sub) return res.status(404);
			sub = _.extend(sub, data);
			Place.findByIdAndUpdate(id, {$set: data}, helpers.simpleObjectResponse(res));
		}
	},
	delete: function(req, res) {
		var id = req.params.id;
		var sub = Place.findById(id, checkOwner);

		function checkOwner(err, sub) {
			if (err) return res.status(500).json(err);
			if (!sub) return res.status(404);
			Place.findByIdAndRemove(id, helpers.simpleOkResponse(res));
		}
	},
	addComment: function(req, res) {
		var id = req.params.id;
		var comment = _.pick(req.body, 'message');
		var user = req.getUser().getData();
		comment.user =  {
			id: user._id,
			name: user.name,
			avatar: user.avatar
		};
		comment.date = Date.now();
		Place.findByIdAndUpdate(id, {$push: {comments: comment}}, helpers.simpleObjectResponse(res));
	}
};
module.exports = controller;