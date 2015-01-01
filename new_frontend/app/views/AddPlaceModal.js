var Place = require('../models/Place');

module.exports = Marionette.ItemView.extend({
	tagName: 'div',
	template: '#add-place-modal-template',
	className: 'addPlaceModal',
	triggers: {
		'click .cancel-button': 'cancel'
	},
	events: {
		'click .save-button': 'savePlace'
	},
	savePlace: function() {
		var that = this;
		var improvement = this.$('[data-value="name"]').val();
		var description = this.$('[data-value="description"]').val();
		var position = this.options.position;
		var place = new Place({
			improvement: improvement,
			description: description,
			latlng: position.lat() + ':' + position.lng()
		});
		place.save().done(function(place) {
			that.trigger('placeCreated', place);
		});
		//@TODO: handle errors
	}
});