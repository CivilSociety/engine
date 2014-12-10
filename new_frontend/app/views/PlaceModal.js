module.exports = Marionette.ItemView.extend({
	tagName: 'div',
	template: '#one-place-modal-template',
	className: 'onePlaceModal',
	templateHelpers: function () {
		return {
			time: function(){
				return moment(this.created_at).format('DD.MM.YYYY');
			}
		}
	}
});