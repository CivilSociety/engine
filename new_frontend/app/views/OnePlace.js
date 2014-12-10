module.exports = Marionette.ItemView.extend({
	tagName: 'div',
	template: '#one-place-template',
	className: 'onePlace',
	childViewEventPrefix: 'onePlace',
	triggers: {
		'click': 'showPlace'
	},
	templateHelpers: function () {
		return {
			time: function(){
				return moment(this.created_at).format('DD.MM.YYYY');
			}
		}
	}
});