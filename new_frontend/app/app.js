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

	Engine.on('authorized', function() {
		deck.render();
	});

	deck.on('childview:showPlace', map.showPlace.bind(map));
	deck.on('authorized', function(authObject) {
		$.post('/auth', authObject).then(function(user, statusText, response) {
			if (response.status != 200) {
				return;
			}

			localStorage.token = user.token;

			window.isAuthorized = function() {
				return true;
			}

			window.getUser = function() {
				return user;
			}

			$.ajaxSetup({
				headers: {'x-auth-token': user.token }
			});
		});
	})
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
	Backbone.history.start();
	if (localStorage.token) {
		window.isAuthorized = function() {
			return true;
		}

		$.ajaxSetup({
			headers: {'x-auth-token': localStorage.token }
		});

		$.get('/auth/me').then(function(user, statusText, response) {
			if (response.status != 200) {
				return;
			}
			window.getUser = function() {
				return user;
			}
			Engine.trigger('authorized');
		});
	}
});

// Load the SDK asynchronously
(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

document.onready = function() {
	Engine.start();
}

window.fbAsyncInit = function() {
	FB.init({
		appId: '1375171772781549',
		cookie: true,  // enable cookies to allow the server to access the session
		xfbml: true,  // parse social plugins on this page
		version: 'v2.1' // use version 2.1
	});
};