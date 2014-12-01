module.exports = Marionette.ItemView.extend({
	tagName: 'div',
	template: '#one-place-template',
	className: 'onePlace',
	events: {
		"click": "showPlace"
	},
	templateHelpers: function () {
		return {
			time: function(){
				return moment(this.created_at).format('DD.MM.YYYY');
			}
		}
	},
	showPlace: function(e) {
		console.log(e)
	}
});