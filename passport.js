var passport = require('passport'),
	config = require('./config'),
	FacebookStrategy = require('passport-facebook').Strategy,
	VKontakteStrategy = require('passport-vkontakte').Strategy;

var User = require('./models/user');

passport.use(new VKontakteStrategy({
		clientID: config.vk.clientID,
		clientSecret: config.vk.clientSecret,
		callbackURL: config.vk.callbackURL
	},
	function(accessToken, refreshToken, profile, done) {
		User.findOne({ vkontakteId: profile.id }, function (err, user) {
			if (user === null) {
				var avatar = '';
				if (profile.photos.length) {
					avatar = profile.photos.pop().value;
				}

				user = new User({
					name: profile.displayName,
					vkontakteId: profile.id,
					profileUrl: profile.profileUrl,
					avatar: avatar
				});
				return user.save(done);
			} else {
				return done(err, user);
			}
		});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});
passport.deserializeUser(function(id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});
/*
passport.use(new FacebookStrategy({
    clientID: config.fb.clientID,
    clientSecret: config.fb.clientSecret,
    callbackURL: config.fb.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ facebookId: profile.id }, function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));*/