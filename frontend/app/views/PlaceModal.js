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
		'click .share-fb-button': 'shareFb',
		'click .share-vk-button': 'shareVk',
		'click .comment-button': 'showCommentForm',
		'click .save-button': 'saveComment',
		'click .vote-button': 'vote',

	},
	templateHelpers: function () {
		return {
			isAuthorized: isAuthorized,
			time: function(){
				return moment(this.created_at).format('DD.MM.YYYY');
			}
		}
	},
	initialize: function() {
		this.collection.fetch({data: {placeId: this.model.get('id')}});
	},
	showCommentForm: function() {
		if (isAuthorized()) {
			this.$('.add-comment-form').slideToggle();
		} else {
			this.trigger('authWarning');
		}
	},
	vote: function() {
		var that = this;
		this.model.vote().then(function(place) {
			that.model.set('votes', place.votes);
			that.trigger('voted', place);
			that.render();
		});
	},
	saveComment () {
		if (!isAuthorized) {
			return this.trigger('authWarning');
		}
		var text = this.$('[data-value="text"]').val().trim();
		if (_.isEmpty(text)) {
			return; //@TODO: show validaion error
		}
		var comment = new Models.Comment({
			text: text,
			placeId: this.model.get('id')
		});
		comment.save().done(this.commentAdded.bind(this));
	},
	commentAdded: function(comment, textResponse) {
		this.collection.add(comment);
		this.render();
	},
	shareVk () {
		let url
		url  = 'http://vkontakte.ru/share.php?'
		url += 'url=' + encodeURIComponent(location.href)
		url += '&title=' + encodeURIComponent(this.model.get('improvement'))
		url += '&description=' + encodeURIComponent(this.model.get('description'))
		url += '&noparse=true';
		window.open(url,'','toolbar=0,status=0,width=626,height=436')
	},
	shareFb: function() {
		FB.ui(
		{
			method: 'share',
			href: location.href + '#placeId=' + this.model.get('id')
		}, function(response){
			// @TODO: do something here
		});
	}
});
