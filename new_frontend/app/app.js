var Views = require('./views');

var Engine = new Backbone.Marionette.Application({container: '#app'});

Engine.addRegions({
	map: '#map',
	deck: '#deck',
	modal: '#modal'
});

$.ajaxSetup({
	headers: {'x-auth-token': localStorage.token }
});


Engine.addInitializer(function(options){

	// @TODO: refactor this shity function
	var map = new Views.Map();
	Engine.map.show(map);

	var deck = new Views.Deck();
	Engine.deck.show(deck);

	Engine.on('authorized', function() {
		deck.render();
	});

	Engine.on('logout', function() {
		delete localStorage.token;

		window.isAuthorized = function() {
			return false;
		}

		window.getUser = function() {
			return null;
		}

		$.ajaxSetup({
			headers: {'x-auth-token': null }
		});
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
			deck.render();
		});
	})

	deck.on('logout', Engine.trigger.bind(Engine, 'logout'));

	map.on('showPlaceModal', function(place) {
		var placeModal = new Views.PlaceModal({
			model: place
		});
		Engine.modal.show(placeModal);
		placeModal.on('voted', function(place) {
			deck.updatePlace(place);
		});
	});

	map.on('newPlace', function(position) {
		var addPlaceModal = new Views.AddPlaceModal({
			position: position
		});
		Engine.modal.show(addPlaceModal);
		addPlaceModal.on('cancel', function() {
			addPlaceModal.destroy();
			$('#modal-container').hide();
		});
		addPlaceModal.on('placeCreated', function(place) {
			deck.addPlace(place);
			map.drawMarker(place);
			addPlaceModal.destroy();
			$('#modal-container').hide();
		});
		addPlaceModal.on('authWarning', function() {
			alert('Auth please');
		});
	});

	Engine.modal.on('before:show', function() {
		$('#modal-container').show();
	});


	$('#modal-container').on('click', function(e) {
		if (e.target.id !== "modal-container") return;
		$('#modal-container').hide();
		map.clearNewPlace();
	});
});

Engine.addInitializer(function(options){
	Backbone.history.start();
	if (localStorage.token) {
		window.isAuthorized = function() {
			return true;
		}
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
		appId: window.config.facebookAppId,
		cookie: true,
		xfbml: true,
		version: 'v2.1'
	});
};