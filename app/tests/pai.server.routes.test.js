'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Pai = mongoose.model('Pai'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, pai;

/**
 * Pai routes tests
 */
describe('Pai CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Pai
		user.save(function() {
			pai = {
				name: 'Pai Name'
			};

			done();
		});
	});

	it('should be able to save Pai instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pai
				agent.post('/pais')
					.send(pai)
					.expect(200)
					.end(function(paiSaveErr, paiSaveRes) {
						// Handle Pai save error
						if (paiSaveErr) done(paiSaveErr);

						// Get a list of Pais
						agent.get('/pais')
							.end(function(paisGetErr, paisGetRes) {
								// Handle Pai save error
								if (paisGetErr) done(paisGetErr);

								// Get Pais list
								var pais = paisGetRes.body;

								// Set assertions
								(pais[0].user._id).should.equal(userId);
								(pais[0].name).should.match('Pai Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Pai instance if not logged in', function(done) {
		agent.post('/pais')
			.send(pai)
			.expect(401)
			.end(function(paiSaveErr, paiSaveRes) {
				// Call the assertion callback
				done(paiSaveErr);
			});
	});

	it('should not be able to save Pai instance if no name is provided', function(done) {
		// Invalidate name field
		pai.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pai
				agent.post('/pais')
					.send(pai)
					.expect(400)
					.end(function(paiSaveErr, paiSaveRes) {
						// Set message assertion
						(paiSaveRes.body.message).should.match('Please fill Pai name');
						
						// Handle Pai save error
						done(paiSaveErr);
					});
			});
	});

	it('should be able to update Pai instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pai
				agent.post('/pais')
					.send(pai)
					.expect(200)
					.end(function(paiSaveErr, paiSaveRes) {
						// Handle Pai save error
						if (paiSaveErr) done(paiSaveErr);

						// Update Pai name
						pai.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Pai
						agent.put('/pais/' + paiSaveRes.body._id)
							.send(pai)
							.expect(200)
							.end(function(paiUpdateErr, paiUpdateRes) {
								// Handle Pai update error
								if (paiUpdateErr) done(paiUpdateErr);

								// Set assertions
								(paiUpdateRes.body._id).should.equal(paiSaveRes.body._id);
								(paiUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Pais if not signed in', function(done) {
		// Create new Pai model instance
		var paiObj = new Pai(pai);

		// Save the Pai
		paiObj.save(function() {
			// Request Pais
			request(app).get('/pais')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Pai if not signed in', function(done) {
		// Create new Pai model instance
		var paiObj = new Pai(pai);

		// Save the Pai
		paiObj.save(function() {
			request(app).get('/pais/' + paiObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', pai.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Pai instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pai
				agent.post('/pais')
					.send(pai)
					.expect(200)
					.end(function(paiSaveErr, paiSaveRes) {
						// Handle Pai save error
						if (paiSaveErr) done(paiSaveErr);

						// Delete existing Pai
						agent.delete('/pais/' + paiSaveRes.body._id)
							.send(pai)
							.expect(200)
							.end(function(paiDeleteErr, paiDeleteRes) {
								// Handle Pai error error
								if (paiDeleteErr) done(paiDeleteErr);

								// Set assertions
								(paiDeleteRes.body._id).should.equal(paiSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Pai instance if not signed in', function(done) {
		// Set Pai user 
		pai.user = user;

		// Create new Pai model instance
		var paiObj = new Pai(pai);

		// Save the Pai
		paiObj.save(function() {
			// Try deleting Pai
			request(app).delete('/pais/' + paiObj._id)
			.expect(401)
			.end(function(paiDeleteErr, paiDeleteRes) {
				// Set message assertion
				(paiDeleteRes.body.message).should.match('User is not logged in');

				// Handle Pai error error
				done(paiDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Pai.remove().exec();
		done();
	});
});