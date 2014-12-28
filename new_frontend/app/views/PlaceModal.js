var Models = require('../models');
var Collections = require('../collections');
var OneComment = require('./OneComment');

module.exports = Marionette.CompositeView.extend({
	tagName: 'div',
	template: '#one-place-modal-template',
	className: 'onePlaceModal',
	childView: OneComment,
	collection: new Collections.Comments(),
	childViewContainer: '.comments',
	events: {
		'click .share-fb': 'shareFb'
	},
	templateHelpers: function () {
		return {
			time: function(){
				return moment(this.created_at).format('DD.MM.YYYY');
			}
		}
	},
	initialize: function() {
		this.collection.fetch({data: {placeId: this.model.get('id')}});
	},
	shareFb: function() {				
		FB.ui(
		{
			method: 'share',
			href: location.href + '#placeId=' + this.model.get('id')
		}, function(response){

		});
	}
});