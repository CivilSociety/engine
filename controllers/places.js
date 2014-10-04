var _ = require('lodash');
var Place = require('../models/place');
var helpers = require('../core/helpers');

var controller = {
	getAll: function(req, res) {
		Place.find().exec(helpers.simpleCollectionResponse(res));
	},
	getPopular: function(req, res) {
		Place.find().sort({votes: -1}).exec(helpers.simpleCollectionResponse(res));
	},
	getById: function(req, res) {
		var id = req.params.id;
		Place.findById(id, helpers.simpleObjectResponse(res));
	},
	create: function(req, res) {
		var data = _.pick(req.body, 'name', 'improvement', 'description', 'latlng');
		var sub = new Place(data);
		sub.save(helpers.simpleCreatedResponse(res));
	},
	vote: function(req, res) {
		var id = req.params.id;
		Place.findByIdAndUpdate(id, { $inc: { votes: 1 }}, helpers.simpleObjectResponse(res));
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
	}
};
module.exports = controller;