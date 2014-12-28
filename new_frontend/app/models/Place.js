module.exports = Backbone.Model.extend({
	url: '/places',
	vote: function() {
		return $.when($.put('/places/' + this.id + '/vote'));
	},
	getPosition: function() {
		var position = this.get('latlng').split(':');
		return new google.maps.LatLng(position[0], position[1]);
	}
});