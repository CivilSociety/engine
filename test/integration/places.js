var expect = require('chai').expect,
	request = require('request').defaults({json: true}),
	config = require('../../config'),
	url = config.url + '/places',
	utils = require('../utils'),
	_ = require('lodash'),
	clubId = config.credentials.clubId;

describe('Places API', function () {
	var headers = {};
	var subscription = {
		name: 'test subscription',
		price: 200,
		type: 3,
		monthesCount: 3,
		lessonsCount: 36
	};
	var result;

	before(function(done) {
		utils.createUser(headers, done);
	});

	describe('create subscription', function() {
		before(function(done) {
			request.post({
				url: url,
				headers: headers,
				body: {subscription: subscription}
			}, save.bind({}, done));
		});

		it('should return status code 201', function() {
			expect(result).to.have.property('statusCode').equals(201);
		});

		it('should return subscription object', function() {
			expect(result)			
				.to.have.property('body')
				.to.have.property('subscription')
				.to.have.property('id');
		});

		it('should have auto setted clubId', function() {
			expect(result)			
				.to.have.property('body')
				.to.have.property('subscription')
				.to.have.property('clubId')
				.to.equals(clubId);
		});

		it('should return the same subscription object', function() {
			var sub = _.clone(result.body.subscription);
			delete sub.id;
			delete sub.clubId;
			expect(sub).to.deep.equal(subscription);
		});

		describe('get subscription by id', function() {
			var createdSubscription;
			before(function(done) {
				createdSubscription = result.body.subscription;
				request.get({
					url: url + '/' + createdSubscription.id,
					headers: headers
				}, save.bind({}, done));
			});

			it('should return status code 200', function() {
				expect(result).to.have.property('statusCode').equals(200);
			});

			it('should return the same subscription object', function() {
				expect(result)
					.to.have.property('body')
					.to.have.property('subscription')
					.to.deep.equal(createdSubscription);
			});
		});
	})

	function save(done, err, response) {
		if (err) return done(err);
		result = response;
		done();
	}
});