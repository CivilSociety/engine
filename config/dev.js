module.exports = {
	db: {
		connectionString: 'mongodb://localhost/ideons'
	},
	publicConstants: {
		title: 'Мой Орёл',
		url: 'http://localhost:3000/',
		apiUrl: 'http://localhost:3000/',
		lon: 36.06863021850586,
		lat: 52.96766504873649,
		zoom: 13,
		facebookAppId: '1375171772781549'
	},
	vk: {
		clientID: '4558998',
		clientSecret: 'WmwCGKf0RrfMhknFGeWk',
		callbackURL: 'http://localhost:3000/auth/vkontakte/callback'
	},
	fb: {
		clientID: '',
		clientSecret: '',
		callbackURL: ''
	}
};