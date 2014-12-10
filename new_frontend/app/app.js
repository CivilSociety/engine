var Views = require('./views');

var Engine = new Backbone.Marionette.Application({container: '#app'});

Engine.addRegions({
	map: '#map',
	deck: '#deck',
	modal: '#modal'
});

Engine.addInitializer(function(options){
	var map = new Views.Map();
	Engine.map.show(map);

	var deck = new Views.Deck();
	Engine.deck.show(deck);

	deck.on('childview:showPlace', map.showPlace.bind(map));
	map.on('showPlaceModal', function(place) {
		var placeModal = new Views.PlaceModal({
			model: place
		});
		Engine.modal.show(placeModal);
	});
	map.on('newPlace', function(position) {
		var addPlaceModal = new Views.AddPlaceModal({
			position: position
		});
		Engine.modal.show(addPlaceModal);
	});

	$('#modal-container').on('click', function(e) {
		if (e.target.id !== "modal-container") return;
		$('#modal-container').hide();
		map.clearNewPlace();
	});
	Engine.modal.on('before:show', function() {
		$('#modal-container').show();
	});
});

Engine.addInitializer(function(options){
  //new MyAppRouter();
	Backbone.history.start();
});
document.onready = function() {
	Engine.start();
}