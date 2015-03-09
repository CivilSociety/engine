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
		facebookAppId: '1375171772781549',	
		vkAppId: '4744279'
	},
	vk: {
		clientID: '4744279',
		clientSecret: 'bnibOG4WffNhLF07KvS7',
		callbackURL: 'http://localhost:3000/auth/vk'
	},
	fb: {
		clientID: '',
		clientSecret: '',
		callbackURL: ''
	}
};