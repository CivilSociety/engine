module.exports = Marionette.ItemView.extend({
	tagName: 'div',
	template: '#one-comment-template',
	className: 'oneComment',
	templateHelpers: function () {
		return {
			isAuthorized: isAuthorized,
			time: function(){
				return moment(this.date).format('DD.MM.YYYY');
			}
		}
	}
});