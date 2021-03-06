module.exports = {
	db: {
		connectionString: process.env.MONGO_CONNECTION
	},
	publicConstants: {
		facebookAppId: process.env.FACEBOOK_APP_ID,
		title: 'Мой Орёл',
		url: 'http://localhost:3000/',
		apiUrl: 'http://localhost:3000/',
		lon: 36.06863021850586,
		lat: 52.96766504873649,
		zoom: 13,
		vkAppId: process.env.VK_APP_ID
	},
	vk: {
		clientID: process.env.VK_APP_ID,
		clientSecret: process.env.VK_APP_SECRET
	},
	fb: {
		clientID: '',
		clientSecret: '',
		callbackURL: ''
	}
};